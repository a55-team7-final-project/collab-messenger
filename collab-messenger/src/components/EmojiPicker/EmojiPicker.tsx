import React from 'react';
import EmojiPicker, { EmojiStyle, EmojiClickData } from 'emoji-picker-react';

interface EmojiPickerProps {
  onSelectEmoji: (emoji: string) => void;
}

const CustomEmojiPicker: React.FC<EmojiPickerProps> = ({ onSelectEmoji }) => {
  const onClick = (emojiData: EmojiClickData) => {
    onSelectEmoji(emojiData.emoji);
  };

  return (
    <EmojiPicker
      onEmojiClick={onClick}
      autoFocusSearch={false}
      emojiStyle={EmojiStyle.APPLE}
    />
  );
};

export default CustomEmojiPicker;