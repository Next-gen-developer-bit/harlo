import { Controller, Get, Param, Post, Body, Query } from '@nestjs/common';
import { Organization } from '@prisma/client';
import { GetOrgFromRequest } from '@gitroom/nestjs-libraries/user/org.from.request';
import { ApiTags } from '@nestjs/swagger';
import { IntegrationService } from '@gitroom/nestjs-libraries/database/prisma/integrations/integration.service';
import { PostsService } from '@gitroom/nestjs-libraries/database/prisma/posts/posts.service';
import { AnalyticsSnapshotDto } from '@gitroom/nestjs-libraries/dtos/analytics/analytics.snapshot.dto';

@ApiTags('Analytics')
@Controller('/analytics')
export class AnalyticsController {
  constructor(
    private _integrationService: IntegrationService,
    private _postsService: PostsService
  ) {}

  @Get('/posts')
  async getPostsAnalytics(
    @GetOrgFromRequest() org: Organization,
    @Query('date') date: string
  ) {
    return this._postsService.getPublishedPostsAnalytics(org.id, +date);
  }

  @Post('/posts/:postId/snapshot')
  async savePostSnapshot(
    @GetOrgFromRequest() org: Organization,
    @Param('postId') postId: string,
    @Body() body: AnalyticsSnapshotDto
  ) {
    return this._postsService.saveAnalyticsSnapshot(org.id, postId, body);
  }

  @Get('/post/:postId')
  async getPostAnalytics(
    @GetOrgFromRequest() org: Organization,
    @Param('postId') postId: string,
    @Query('date') date: string
  ) {
    return this._postsService.checkPostAnalytics(org.id, postId, +date);
  }

  @Get('/:integration')
  async getIntegration(
    @GetOrgFromRequest() org: Organization,
    @Param('integration') integration: string,
    @Query('date') date: string
  ) {
    return this._integrationService.checkAnalytics(org, integration, date);
  }
}
