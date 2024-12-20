import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';

import { styles } from '../styles/shared-styles';

@customElement('app-home')
export class AppHome extends LitElement {

  // For more information on using properties and state in lit
  // check out this link https://lit.dev/docs/components/properties/
  @property() message = 'PWA only for testing access to Sharepoint files.';

  static styles = [
    styles,
    css`
    #welcomeBar {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    #welcomeCard,
    #infoCard {
      width: 100%;
      padding: 18px;
      padding-top: 0px;
    }

    sl-card::part(footer) {
      display: flex;
      justify-content: flex-end;
    }

    .file-list {
      list-style: none;
      display: flex;
      gap: 20px;
      padding: 0;
      margin: 0;
    }

    @media(min-width: 750px) {
      sl-card {
        width: 70vw;
      }
    }


    @media (horizontal-viewport-segments: 2) {
      #welcomeBar {
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
      }

      #welcomeCard {
        margin-right: 64px;
      }
    }
  `];

  async firstUpdated() {
    // this method is a lifecycle even in lit
    // for more info check out the lit docs https://lit.dev/docs/components/lifecycle/
    console.log('This is your home page');
  }

  share() {
    if ((navigator as any).share) {
      (navigator as any).share({
        title: 'PWABuilder pwa-starter',
        text: 'Check out the PWABuilder pwa-starter!',
        url: 'https://github.com/pwa-builder/pwa-starter',
      });
    }
  }

  render() {
    return html`
      <main>
        <div id="welcomeBar">
          <sl-card id="welcomeCard">
            <div slot="header">
              <h2>${this.message}</h2>
            </div>
            <h2>Files:</h2>
            <ul class="file-list">
              <li>
                <sl-button size="small" href="https://onlinetestcase.com/wp-content/uploads/2023/06/500-KB.pdf">PDF</sl-button>
              </li>
              <li>
                <sl-button size="small" href="https://file-examples.com/wp-content/storage/2017/02/file_example_XLSX_100.xlsx">EXCEL</sl-button>
              </li>
              <li>
                <sl-button size="small" href="https://file-examples.com/wp-content/storage/2017/02/file-sample_100kB.doc">DOC</sl-button>
              </li>
              <li>
                <sl-button size="small" href="https://scholar.harvard.edu/files/torman_personal/files/samplepptx.pptx">PPTX</sl-button>
              </li>
            </ul>
          </sl-card>
        </div>
      </main>
    `;
  }
}
