import { PrismaRepository } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import { PrismaClient, Role, ShortLinkPreference, SubscriptionTier } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { AuthService } from '@gitroom/helpers/auth/auth.service';
import { CreateOrgUserDto } from '@gitroom/nestjs-libraries/dtos/auth/create.org.user.dto';
import { makeId } from '@gitroom/nestjs-libraries/services/make.is';

@Injectable()
export class OrganizationRepository {
  constructor(
    private _organization: PrismaRepository<'organization'>,
    private _userOrg: PrismaRepository<'userOrganization'>,
    private _user: PrismaRepository<'user'>
  ) {}

  createMaxUser(id: string, name: string, saasName: string, email: string) {
    return this._organization.model.organization.create({
      select: {
        id: true,
        apiKey: true,
      },
      data: {
        name: name ? `${name}###${id}` : `Unnamed User###${id}`,
        apiKey: AuthService.fixedEncryption(makeId(20)),
        isTrailing: false,
        subscription: {
          create: {
            totalChannels: 1000000,
            subscriptionTier: 'ULTIMATE',
            isLifetime: true,
            period: 'YEARLY',
          },
        },
        users: {
          create: {
            role: Role.SUPERADMIN,
            user: {
              create: {
                activated: true,
                email: email
                  ? email.split('@').join(`+${saasName}@`)
                  : `${saasName}+` + makeId(10) + '@poscally.com',
                name: name ? `${name}###${id}` : `Unnamed User###${id}`,
                providerName: 'LOCAL',
                password: AuthService.hashPassword(makeId(500)),
                timezone: 0,
              },
            },
          },
        },
      },
    });
  }

  getOrgByApiKey(api: string) {
    return this._organization.model.organization.findFirst({
      where: {
        apiKey: api,
      },
      include: {
        subscription: {
          select: {
            subscriptionTier: true,
            totalChannels: true,
            isLifetime: true,
          },
        },
      },
    });
  }

  getCount() {
    return this._organization.model.organization.count();
  }

  getUserOrg(id: string) {
    return this._userOrg.model.userOrganization.findFirst({
      where: {
        id,
      },
      select: {
        user: true,
        organization: {
          include: {
            users: {
              select: {
                id: true,
                disabled: true,
                role: true,
                userId: true,
              },
            },
            subscription: {
              select: {
                subscriptionTier: true,
                totalChannels: true,
                isLifetime: true,
              },
            },
          },
        },
      },
    });
  }

  getImpersonateUser(name: string) {
    return this._userOrg.model.userOrganization.findMany({
      where: {
        OR: [
          {
            organizationId: {
              contains: name,
            },
          },
          {
            user: {
              OR: [
                {
                  name: {
                    contains: name,
                    mode: 'insensitive',
                  },
                },
                {
                  email: {
                    contains: name,
                    mode: 'insensitive',
                  },
                },
                {
                  id: {
                    contains: name,
                  },
                },
              ],
            },
          },
        ],
      },
      select: {
        id: true,
        role: true,
        organization: {
          select: {
            id: true,
            name: true,
            subscription: {
              select: {
                subscriptionTier: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  updateApiKey(orgId: string) {
    return this._organization.model.organization.update({
      where: {
        id: orgId,
      },
      data: {
        apiKey: AuthService.fixedEncryption(makeId(20)),
      },
    });
  }

  async getOrgsByUserId(userId: string) {
    return this._organization.model.organization.findMany({
      where: {
        users: {
          some: {
            userId,
          },
        },
      },
      include: {
        users: {
          where: {
            userId,
          },
          select: {
            disabled: true,
            role: true,
          },
        },
        subscription: {
          select: {
            subscriptionTier: true,
            totalChannels: true,
            isLifetime: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async getOrgById(id: string) {
    return this._organization.model.organization.findUnique({
      where: {
        id,
      },
    });
  }

  getUsersByEmail(email: string) {
    return this._user.model.user.findMany({
      where: {
        email,
      },
    });
  }

  async addUserToOrg(
    userId: string,
    id: string,
    orgId: string,
    role: 'USER' | 'ADMIN'
  ) {
    const alreadyMember = await this._userOrg.model.userOrganization.findFirst({
      where: {
        userId,
        organizationId: orgId,
      },
    });
    if (alreadyMember) {
      return alreadyMember;
    }

    const checkIfInviteExists = await this._user.model.user.findFirst({
      where: {
        inviteId: id,
      },
    });

    if (checkIfInviteExists) {
      return false;
    }

    const checkForSubscription =
      await this._organization.model.organization.findFirst({
        where: {
          id: orgId,
        },
        select: {
          subscription: true,
        },
      });

    if (
      process.env.STRIPE_PUBLISHABLE_KEY &&
      checkForSubscription?.subscription?.subscriptionTier ===
        SubscriptionTier.STANDARD
    ) {
      return false;
    }

    const create = await this._userOrg.model.userOrganization.create({
      data: {
        role,
        userId,
        organizationId: orgId,
      },
    });

    await this._user.model.user.update({
      where: {
        id: userId,
      },
      data: {
        inviteId: id,
      },
    });

    return create;
  }

  renameWorkspace(orgId: string, name: string) {
    return this._organization.model.organization.update({
      where: { id: orgId },
      data: { name },
      select: { id: true, name: true },
    });
  }

  async deleteWorkspace(orgId: string) {
    const prisma = this._organization.model as unknown as PrismaClient;
    await prisma.$transaction(async (tx) => {
      const posts = await tx.post.findMany({
        where: { organizationId: orgId },
        select: { id: true },
      });
      const postIds = posts.map((post) => post.id);
      const integrations = await tx.integration.findMany({
        where: { organizationId: orgId },
        select: { id: true },
      });
      const integrationIds = integrations.map((integration) => integration.id);

      if (postIds.length) {
        await tx.tagsPosts.deleteMany({ where: { postId: { in: postIds } } });
        await tx.comments.deleteMany({ where: { postId: { in: postIds } } });
        await tx.errors.deleteMany({ where: { postId: { in: postIds } } });
        await tx.payoutProblems.deleteMany({ where: { postId: { in: postIds } } });
        await tx.post.updateMany({
          where: { parentPostId: { in: postIds } },
          data: { parentPostId: null },
        });
        await tx.post.updateMany({
          where: { id: { in: postIds } },
          data: { lastMessageId: null, submittedForOrderId: null },
        });
      }

      await tx.post.updateMany({
        where: { submittedForOrganizationId: orgId },
        data: { submittedForOrganizationId: null },
      });
      await tx.post.deleteMany({ where: { organizationId: orgId } });

      if (integrationIds.length) {
        await tx.exisingPlugData.deleteMany({
          where: { integrationId: { in: integrationIds } },
        });
        await tx.integrationsWebhooks.deleteMany({
          where: { integrationId: { in: integrationIds } },
        });
        await tx.orderItems.deleteMany({
          where: { integrationId: { in: integrationIds } },
        });
      }

      await tx.plugs.deleteMany({ where: { organizationId: orgId } });
      await tx.integration.deleteMany({ where: { organizationId: orgId } });
      await tx.customer.deleteMany({ where: { orgId } });
      await tx.tagsPosts.deleteMany({ where: { tag: { orgId } } });
      await tx.tags.deleteMany({ where: { orgId } });
      await tx.usedCodes.deleteMany({ where: { orgId } });
      await tx.gitHub.deleteMany({ where: { organizationId: orgId } });
      await tx.comments.deleteMany({ where: { organizationId: orgId } });
      await tx.errors.deleteMany({ where: { organizationId: orgId } });
      await tx.signatures.deleteMany({ where: { organizationId: orgId } });
      await tx.notifications.deleteMany({ where: { organizationId: orgId } });
      await tx.credits.deleteMany({ where: { organizationId: orgId } });
      await tx.subscription.deleteMany({ where: { organizationId: orgId } });
      await tx.autoPost.deleteMany({ where: { organizationId: orgId } });
      await tx.sets.deleteMany({ where: { organizationId: orgId } });
      await tx.thirdParty.deleteMany({ where: { organizationId: orgId } });
      await tx.integrationsWebhooks.deleteMany({
        where: { webhook: { organizationId: orgId } },
      });
      await tx.webhooks.deleteMany({ where: { organizationId: orgId } });
      await tx.oAuthAuthorization.deleteMany({ where: { organizationId: orgId } });
      await tx.oAuthApp.updateMany({
        where: { organizationId: orgId },
        data: { pictureId: null },
      });
      await tx.oAuthApp.deleteMany({ where: { organizationId: orgId } });

      const media = await tx.media.findMany({
        where: { organizationId: orgId },
        select: { id: true },
      });
      const mediaIds = media.map((item) => item.id);
      if (mediaIds.length) {
        await tx.user.updateMany({
          where: { pictureId: { in: mediaIds } },
          data: { pictureId: null },
        });
        await tx.socialMediaAgency.updateMany({
          where: { logoId: { in: mediaIds } },
          data: { logoId: null },
        });
        await tx.oAuthApp.updateMany({
          where: { pictureId: { in: mediaIds } },
          data: { pictureId: null },
        });
      }
      await tx.media.deleteMany({ where: { organizationId: orgId } });

      const groups = await tx.messagesGroup.findMany({
        where: { buyerOrganizationId: orgId },
        select: { id: true },
      });
      const groupIds = groups.map((group) => group.id);
      if (groupIds.length) {
        const orders = await tx.orders.findMany({
          where: { messageGroupId: { in: groupIds } },
          select: { id: true },
        });
        const orderIds = orders.map((order) => order.id);
        if (orderIds.length) {
          await tx.payoutProblems.deleteMany({
            where: { orderId: { in: orderIds } },
          });
          await tx.orderItems.deleteMany({ where: { orderId: { in: orderIds } } });
          await tx.post.updateMany({
            where: { submittedForOrderId: { in: orderIds } },
            data: { submittedForOrderId: null },
          });
          await tx.orders.deleteMany({ where: { id: { in: orderIds } } });
        }
        await tx.post.updateMany({
          where: { lastMessage: { groupId: { in: groupIds } } },
          data: { lastMessageId: null },
        });
        await tx.messages.deleteMany({ where: { groupId: { in: groupIds } } });
        await tx.messagesGroup.deleteMany({ where: { id: { in: groupIds } } });
      }

      await tx.userOrganization.deleteMany({ where: { organizationId: orgId } });
      await tx.organization.delete({ where: { id: orgId } });
    }, { timeout: 30000 });
  }

  async createWorkspaceForUser(userId: string, name: string) {
    return this._organization.model.organization.create({
      data: {
        name,
        apiKey: AuthService.fixedEncryption(makeId(20)),
        allowTrial: true,
        isTrailing: true,
        users: {
          create: {
            role: Role.SUPERADMIN,
            userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async createOrgAndUser(
    body: Omit<CreateOrgUserDto, 'providerToken'> & { providerId?: string },
    hasEmail: boolean,
    ip: string,
    userAgent: string
  ) {
    return this._organization.model.organization.create({
      data: {
        name: body.company || body.email?.split('@')[0] || 'My Organization',
        apiKey: AuthService.fixedEncryption(makeId(20)),
        allowTrial: true,
        isTrailing: true,
        users: {
          create: {
            role: Role.SUPERADMIN,
            user: {
              create: {
                activated: body.provider !== 'LOCAL' || !hasEmail,
                email: body.email,
                password: body.password
                  ? AuthService.hashPassword(body.password)
                  : '',
                providerName: body.provider,
                providerId: body.providerId || '',
                timezone: 0,
                ip,
                agent: userAgent,
              },
            },
          },
        },
      },
      select: {
        id: true,
        users: {
          select: {
            user: true,
          },
        },
      },
    });
  }

  getOrgByCustomerId(customerId: string) {
    return this._organization.model.organization.findFirst({
      where: {
        paymentId: customerId,
      },
    });
  }

  async setStreak(organizationId: string, type: 'start' | 'end') {
    try {
      await this._organization.model.organization.update({
        where: {
          id: organizationId,
          ...(type === 'start'
            ? {
                streakSince: null,
              }
            : {}),
        },
        data: {
          ...(type === 'end' ? { streakSince: null } : {}),
          ...(type === 'start' ? { streakSince: new Date() } : {}),
        },
      });
    } catch (err) {}
  }

  async getTeam(orgId: string) {
    return this._organization.model.organization.findUnique({
      where: {
        id: orgId,
      },
      select: {
        users: {
          select: {
            role: true,
            user: {
              select: {
                email: true,
                id: true,
                name: true,
                lastName: true,
                sendSuccessEmails: true,
                sendFailureEmails: true,
                sendStreakEmails: true,
              },
            },
          },
        },
      },
    });
  }

  getAllUsersOrgs(orgId: string) {
    return this._organization.model.organization.findUnique({
      where: {
        id: orgId,
      },
      select: {
        users: {
          select: {
            user: {
              select: {
                email: true,
                id: true,
                sendSuccessEmails: true,
                sendFailureEmails: true,
              },
            },
          },
        },
      },
    });
  }

  async deleteTeamMember(orgId: string, userId: string) {
    return this._userOrg.model.userOrganization.delete({
      where: {
        userId_organizationId: {
          userId,
          organizationId: orgId,
        },
      },
    });
  }

  disableOrEnableNonSuperAdminUsers(orgId: string, disable: boolean) {
    return this._userOrg.model.userOrganization.updateMany({
      where: {
        organizationId: orgId,
        role: {
          not: Role.SUPERADMIN,
        },
      },
      data: {
        disabled: disable,
      },
    });
  }

  getShortlinkPreference(orgId: string) {
    return this._organization.model.organization.findUnique({
      where: {
        id: orgId,
      },
      select: {
        shortlink: true,
      },
    });
  }

  updateShortlinkPreference(orgId: string, shortlink: ShortLinkPreference) {
    return this._organization.model.organization.update({
      where: {
        id: orgId,
      },
      data: {
        shortlink,
      },
    });
  }
}
