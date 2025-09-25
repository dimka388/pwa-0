import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js';
import '@shoelace-style/shoelace/dist/components/radio/radio.js';
import '@shoelace-style/shoelace/dist/components/radio-group/radio-group.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';

import { styles } from '../styles/shared-styles';
import { ApiService } from '../services/api';

@customElement('app-form')
export class AppForm extends LitElement {

  @property() title = 'Example Form Page';
  @property() formData = {
    name: '',
    email: '',
    phone: '',
    category: '',
    priority: '',
    message: '',
    newsletter: false
  };
  @property() isSubmitting = false;
  @property() submitMessage = '';

  // Ensure proper initialization
  connectedCallback() {
    super.connectedCallback();
    // Make sure newsletter is always a boolean
    this.formData = {
      ...this.formData,
      newsletter: Boolean(this.formData.newsletter)
    };
  }

  static styles = [
    styles,
    css`
      .form-container {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding: 20px;
      }

      .form-card {
        width: 100%;
        max-width: 600px;
        padding: 24px;
      }

      .form-group {
        margin-bottom: 16px;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      .form-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 24px;
      }

      sl-input, sl-textarea, sl-select {
        width: 100%;
      }

      sl-card::part(footer) {
        padding: 0;
      }

      @media (max-width: 600px) {
        .form-row {
          grid-template-columns: 1fr;
        }
      }

      .submit-feedback {
        margin-bottom: 16px;
      }

      .loading-button {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    `
  ];

  private handleInputChange(event: Event) {
    const target = event.target as any;
    const name = target.name;
    let value: any;

    // Handle different input types
    if (target.type === 'checkbox') {
      value = target.checked;
    } else if (target.tagName?.toLowerCase() === 'sl-checkbox') {
      value = target.checked;
    } else {
      value = target.value;
    }

    console.log(`Field changed: ${name} = ${value} (type: ${typeof value})`);

    this.formData = {
      ...this.formData,
      [name]: value
    };

    // Force update to ensure UI reflects the change
    this.requestUpdate();
  }

  private handleCheckboxClick(event: Event) {
    // Additional handler to ensure checkbox state is captured
    const target = event.target as any;
    if (target.name === 'newsletter') {
      console.log('Checkbox clicked - checked state:', target.checked);
      this.formData = {
        ...this.formData,
        newsletter: Boolean(target.checked)
      };
      this.requestUpdate();
    }
  }

  private async handleSubmit(event: Event) {
    event.preventDefault();

    this.isSubmitting = true;
    this.submitMessage = '';

    // Ensure all form values are properly set, especially boolean fields
    const submissionData = {
      ...this.formData,
      newsletter: Boolean(this.formData.newsletter) // Ensure it's always a boolean
    };

    console.log('Submitting form data:', submissionData);

    try {
      const result = await ApiService.submitForm(submissionData);

      if (result.success) {
        this.submitMessage = result.message || 'Form submitted successfully!';
        this.handleReset();
      } else {
        this.submitMessage = result.message || 'Failed to submit form. Please try again.';
      }
    } catch (error) {
      console.error('Unexpected error during form submission:', error);
      this.submitMessage = 'An unexpected error occurred. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }

  private handleReset() {
    this.formData = {
      name: '',
      email: '',
      phone: '',
      category: '',
      priority: '',
      message: '',
      newsletter: false
    };
    this.submitMessage = '';
    this.requestUpdate();
  }

  render() {
    return html`
      <app-header ?enableBack="${true}"></app-header>

      <main>
        <div class="form-container">
          <sl-card class="form-card">
            <div slot="header">
              <h2>${this.title}</h2>
              <p>Fill out this example form to see how form components work in this PWA.</p>
            </div>

            <form @submit="${this.handleSubmit}">
              <div class="form-row">
                <div class="form-group">
                  <sl-input
                    name="name"
                    label="Full Name"
                    placeholder="Enter your full name"
                    .value="${this.formData.name}"
                    @sl-input="${this.handleInputChange}"
                    required>
                  </sl-input>
                </div>

                <div class="form-group">
                  <sl-input
                    name="email"
                    type="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    .value="${this.formData.email}"
                    @sl-input="${this.handleInputChange}"
                    required>
                  </sl-input>
                </div>
              </div>

              <div class="form-group">
                <sl-input
                  name="phone"
                  type="tel"
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  .value="${this.formData.phone}"
                  @sl-input="${this.handleInputChange}">
                </sl-input>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <sl-select
                    name="category"
                    label="Category"
                    placeholder="Select a category"
                    .value="${this.formData.category}"
                    @sl-change="${this.handleInputChange}">
                    <sl-option value="general">General Inquiry</sl-option>
                    <sl-option value="support">Technical Support</sl-option>
                    <sl-option value="sales">Sales</sl-option>
                    <sl-option value="feedback">Feedback</sl-option>
                  </sl-select>
                </div>

                <div class="form-group">
                  <label>Priority Level</label>
                  <sl-radio-group
                    name="priority"
                    .value="${this.formData.priority}"
                    @sl-change="${this.handleInputChange}">
                    <sl-radio value="low">Low</sl-radio>
                    <sl-radio value="medium">Medium</sl-radio>
                    <sl-radio value="high">High</sl-radio>
                  </sl-radio-group>
                </div>
              </div>

              <div class="form-group">
                <sl-textarea
                  name="message"
                  label="Message"
                  placeholder="Enter your message here..."
                  rows="4"
                  .value="${this.formData.message}"
                  @sl-input="${this.handleInputChange}"
                  required>
                </sl-textarea>
              </div>

              <div class="form-group">
                <sl-checkbox
                  name="newsletter"
                  .checked="${this.formData.newsletter}"
                  @sl-change="${this.handleInputChange}"
                  @click="${this.handleCheckboxClick}">
                  Subscribe to our newsletter
                </sl-checkbox>
              </div>
            </form>

            ${this.submitMessage ? html`
              <div class="submit-feedback">
                <sl-alert
                  variant="${this.submitMessage.includes('success') ? 'success' : 'danger'}"
                  open>
                  <sl-icon slot="icon" name="${this.submitMessage.includes('success') ? 'check2-circle' : 'exclamation-triangle'}"></sl-icon>
                  ${this.submitMessage}
                </sl-alert>
              </div>
            ` : ''}

            <div slot="footer" class="form-actions">
              <sl-button
                variant="neutral"
                @click="${this.handleReset}"
                ?disabled="${this.isSubmitting}">
                Reset
              </sl-button>
              <sl-button
                variant="primary"
                @click="${this.handleSubmit}"
                ?disabled="${this.isSubmitting}"
                ?loading="${this.isSubmitting}">
                <div class="loading-button">
                  ${this.isSubmitting ? html`<sl-spinner></sl-spinner>` : ''}
                  ${this.isSubmitting ? 'Submitting...' : 'Submit Form'}
                </div>
              </sl-button>
            </div>
          </sl-card>
        </div>
      </main>
    `;
  }
}