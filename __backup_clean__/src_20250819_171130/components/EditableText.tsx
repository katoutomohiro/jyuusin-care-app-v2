import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';

/**
 * EditableText component allows any text in the UI to be edited in-place when the app
 * is in administrator mode. When not in admin mode the text is rendered as a simple
 * span. Edited values are persisted to localStorage using a unique key so that
 * offline customisations persist across reloads.
 */
interface EditableTextProps {
  /** Unique key used to store the edited value in localStorage */
  textKey: string;
  /** Default value shown when nothing has been customised yet */
  defaultText: string;
  /** Optional CSS classes to apply to the wrapper element */
  className?: string;
}

const EditableText: React.FC<EditableTextProps> = ({
  textKey,
  defaultText,
  className = '',
}) => {
  const { isAdminMode } = useAdmin();
  const [text, setText] = useState<string>(defaultText);

  // On mount load any customised value from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`editableText_${textKey}`);
    if (saved !== null) {
      setText(saved);
    }
  }, [textKey]);

  // Handle edits and persist them to localStorage
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    try {
      localStorage.setItem(`editableText_${textKey}`, newText);
    } catch (error) {
      console.warn('Failed to save edited text', error);
    }
  };

  if (isAdminMode) {
    // For long text strings use a textarea, otherwise use an input
    const isLong = defaultText.length > 20;
    return isLong ? (
      <textarea
        value={text}
        onChange={handleChange}
        className={className}
        rows={2}
      />
    ) : (
      <input
        type="text"
        value={text}
        onChange={handleChange}
        className={className}
      />
    );
  }

  return <span className={className}>{text}</span>;
};

export default EditableText;