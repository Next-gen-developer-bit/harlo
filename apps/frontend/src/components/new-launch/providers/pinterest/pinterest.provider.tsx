'use client';

import { FC } from 'react';
import {
  PostComment,
  withProvider,
} from '@gitroom/frontend/components/new-launch/providers/high.order.provider';
import { useSettings } from '@gitroom/frontend/components/launches/helpers/use.values';
import { PinterestBoard } from '@gitroom/frontend/components/new-launch/providers/pinterest/pinterest.board';
import { PinterestSettingsDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/pinterest.dto';
import { Input } from '@gitroom/react/form/input';
import { ColorPicker } from '@gitroom/react/form/color.picker';
import { PinterestPreview } from '@gitroom/frontend/components/new-launch/providers/pinterest/pinterest.preview';
import { MediaComponent } from '@gitroom/frontend/components/media/media.component';
const PinterestSettings: FC = () => {
  const { register } = useSettings();
  return (
    <div className="flex flex-col gap-[20px]">
      <Input label={'Title'} {...register('title')} />
      <Input label={'Link'} {...register('link')} />
      <PinterestBoard {...register('board')} />
      <MediaComponent
        type="image"
        hideEditor={true}
        label="Cover image"
        description="Required for video pins. Image pins use the attached photo instead."
        {...register('cover')}
      />
      <ColorPicker
        label="Pin color"
        name="dominant_color"
        enabled={false}
        canBeCancelled={true}
      />
    </div>
  );
};
export default withProvider({
  postComment: PostComment.COMMENT,
  minimumCharacters: [],
  comments: false,
  SettingsComponent: PinterestSettings,
  CustomPreviewComponent: PinterestPreview,
  dto: PinterestSettingsDto,
  maximumCharacters: 500,
});
