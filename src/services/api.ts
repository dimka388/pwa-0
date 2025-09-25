import { ENV_CONFIG, HTTP_CONFIG } from '../config/environment';

export interface FormData {
  name: string;
  email: string;
  phone: string;
  category: string;
  priority: string;
  message: string;
  newsletter: boolean;
}

export class ApiService {
  private static async makeRequest(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), HTTP_CONFIG.TIMEOUT);

    // Debug logging
    if (ENV_CONFIG.DEBUG) {
      console.log('Making request to:', url);
      console.log('Request options:', options);
      console.log('Origin:', window.location.origin);
    }

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        mode: 'cors',
        headers: {
          ...HTTP_CONFIG.DEFAULT_HEADERS,
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (ENV_CONFIG.DEBUG) {
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (ENV_CONFIG.DEBUG) {
        console.error('Request failed:', error);
      }
      throw error;
    }
  }

  static async submitForm(formData: FormData): Promise<{ success: boolean; message?: string }> {
    try {
      // First, try the normal POST request
      const response = await this.makeRequest(ENV_CONFIG.FORM_SUBMISSION_URL, {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        try {
          const result = await response.json();
          // Handle both old "OK" responses and new JSON responses
          if (typeof result === 'string' && result === 'OK') {
            return { success: true, message: 'Form submitted successfully!' };
          } else if (result.success !== undefined) {
            return { success: result.success, message: result.message || 'Form submitted successfully!' };
          } else {
            return { success: true, message: 'Form submitted successfully!' };
          }
        } catch (jsonError) {
          if (response.status === 200) {
            return { success: true, message: 'Form submitted successfully!' };
          }
          throw new Error('Invalid response format');
        }
      } else {
        return {
          success: false,
          message: `Server error: ${response.status} ${response.statusText}`
        };
      }
    } catch (error) {
      console.error('Form submission error:', error);

      // Check if it's a CORS error and provide helpful message
      if (error instanceof TypeError && (
        error.message.includes('CORS') ||
        error.message.includes('Network request failed') ||
        error.message.includes('Failed to fetch')
      )) {
        return {
          success: false,
          message: 'CORS error: Please make sure your Google Apps Script is properly configured and deployed.'
        };
      }

      if (error instanceof DOMException && error.name === 'AbortError') {
        return { success: false, message: 'Request timed out. Please try again.' };
      }

      return {
        success: false,
        message: 'Network error. Please check your connection and try again.'
      };
    }
  }

  // You can add more API methods here as your app grows
  // static async uploadFile(file: File): Promise<{ success: boolean; url?: string }> { ... }
  // static async getSharePointFiles(): Promise<{ success: boolean; files?: any[] }> { ... }
}