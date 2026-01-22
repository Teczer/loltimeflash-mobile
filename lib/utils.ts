import { clsx, type ClassValue } from 'clsx';

/**
 * Merge class names with clsx
 * Note: twMerge is not needed in React Native since Uniwind handles conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Generate a random lobby code
 * @param length - Length of the code (default: 10)
 * @returns Random alphanumeric string
 */
export function generateLobbyCode(length: number = 10): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Capitalize the first letter of a string
 */
export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
