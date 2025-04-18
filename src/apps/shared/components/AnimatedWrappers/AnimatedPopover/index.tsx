import { Popover, PopoverProps } from 'antd';
import { useState } from 'react';

import { CustomAnimationProps } from '../domain';

import { useTimeout } from '../../../hooks';
import { cx } from '../../../styles';

export interface AnimatedPopoverProps extends PopoverProps {
  animationDescription: CustomAnimationProps;
}

export function AnimatedPopover({
  children,
  open,
  onOpenChange,
  content,
  animationDescription,
  ...popoverProps
}: AnimatedPopoverProps) {
  const [delayedOpenPopover, setDelayedOpenPopover] = useState(false);
  const [openReplacement, setOpenReplacement] = useState(false);

  useTimeout(
    () => {
      setDelayedOpenPopover(open || openReplacement);
    },
    animationDescription.maxAnimationTimeMs ?? 500,
    [open || openReplacement],
  );

  const animationObject: Record<string, boolean> = {};
  if (animationDescription.openAnimationName) {
    animationObject[animationDescription.openAnimationName] =
      (open || openReplacement) && !delayedOpenPopover;
  }
  if (animationDescription.closeAnimationName) {
    animationObject[animationDescription.closeAnimationName] =
      delayedOpenPopover && !(open || openReplacement);
  }

  return (
    <Popover
      {...popoverProps}
      arrow={false}
      open={open || delayedOpenPopover}
      onOpenChange={(open, info) => {
        if (onOpenChange) {
          onOpenChange(open, info);
        } else {
          setOpenReplacement(open);
        }
      }}
      content={
        content && (
          <div className={cx(animationObject)}>
            <>{content}</>
          </div>
        )
      }
    >
      {children}
    </Popover>
  );
}
