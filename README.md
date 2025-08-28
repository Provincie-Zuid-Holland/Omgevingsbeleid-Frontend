<img src="https://www.zuid-holland.nl/publish/pages/28722/pzh-basislogo-rgb_export-figma.svg" alt="Provincie Zuid-Holland logo" width="220px">

# Omgevingsbeleid front-end · ![License](https://img.shields.io/github/license/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend)

## Objectives

The Province of South-Holland believes that everyone should be able to easily view its policies. By digitalizing them, the province aims to make its policies more transparant, accesible, current, and informative. This way new initiatives can be carried out faster and better and in turn will result in more coherent policies.
By storing policies in a database instead of in a document, the province also aims to make the proces of creating new or adjusting policies more efficient and in line with the new Dutch standards ([STOP](https://www.koopoverheid.nl/standaarden/stop-standaard)) for publishing governmental plans.

## Application

The application digitalizes the 'physical living environment' policies of the Province of South-Holland. Non authorized users can search policies by text or using a map, see in what area they apply and and view connections between policies. Authorized users can adjust and manage the policies. You can view the roadmap [here](https://www.figma.com/proto/hg7QFPhoCg0juUu3jEdG6w/Omgevingsbeleid-Roadmap?page-id=0%3A1&node-id=1%3A4&viewport=430%2C426%2C0.17213496565818787&scaling=min-zoom&starting-point-node-id=1%3A4).

## Standard for Public Code

It is the intent of the Omgevingsbeleid development community to develop the codebase collaboratively.
Adhering to the criteria set forth in [the Standard for Public Code](https://standard.publiccode.net/) gives us confidence in the process.
Therefore, The Province of South-Holland is committed to maintaining and developing Omgevingsbeleid front-end at a level of quality that meets the Standard for Public Code.

## Pre-Requisites

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/getting-started/install)

## Setting up a local version

---

### Clone and install packages

```sh
git clone https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend.git
cd Omgevingsbeleid-Frontend
yarn
```

### Create a .env file

Create a `.env` file in the root of the project with the following variables:

```env
VITE_API_URL_DEV=
VITE_API_URL_TEST=
VITE_API_URL_ACC=
VITE_API_URL_PROD=
VITE_GEOSERVER_API_URL=        # Used in the Geoserver API url (in axiosGeoJSON.ts)
VITE_API_ENV=dev               # Used to get correct API url (in instance.ts)
VITE_KEY_API_ACCESS_TOKEN=     # Used to set login token
VITE_KEY_IDENTIFIER=           # Used to set login identifier
VITE_ENABLE_AXE=true           # Used to see accessibility issues in the console
VITE_GTAG_ID=                  # Used to enable tracking using Google Tag Manager
VITE_CRYPTO_SECRET_KEY=        # Used for encryption/decryption in utils/encryption.ts
```

## Available scripts

---

- **Start development server:**

    ```sh
    yarn start
    ```

    Runs the app in development mode at [http://localhost:3000](http://localhost:3000/). Supports Vite HMR for fast refresh.

- **Run tests:**

    ```sh
    yarn test
    ```

    Launches the test runner in interactive watch mode. Uses [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

- **Build for production:**

    ```sh
    yarn build
    ```

    Builds the app for production to the `dist` folder.

- **Generate API types and fetchers (Orval):**

    ```sh
    yarn generate-types
    ```

    Generates TypeScript API clients and models from the OpenAPI spec using [Orval](https://orval.dev/).

## Source File Structure

---

```
src/
  api/            # API clients and generated fetchers (Orval)
  App/            # Main application component and routing
  components/     # Reusable UI components
  config/         # Configuration files for policy objects
  constants/      # Application-wide constants
  context/        # React context providers
  css/            # Tailwind and Sass styles
  fonts/          # Custom fonts
  hooks/          # Custom React hooks
  images/         # Images and logos
  mocks/          # Mock data for development/testing
  pages/          # Page-level components
  store/          # State management
  templates/      # Page and component templates
  types/          # TypeScript types and interfaces
  utils/          # Utility functions (e.g., encryption)
  validation/     # Validation schemas
```

### API

- `instance.ts` - Axios instance for the main API ([API docs](https://api-obzh.azurewebsites.net/docs))
- `axiosGeoJSON.ts` - Axios instance for the GEO Server
- `axiosLocatieserver.ts` - Axios instance for PDOK Location server
- `fetchers.ts` - **Generated**: All API endpoints (Orval)
- `fetchers.schemas.ts` - **Generated**: All TypeScript models (Orval)

Generate these files with:

```sh
yarn generate-types
```

### Styling

- Uses [Tailwind CSS](https://tailwindcss.com/) and Sass for styling.
- Custom classes are defined in `tailwind.src.css` and `styles.scss`.

### Testing

- Static testing via ESLint.
- Unit testing with [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center">
      <a href="https://www.copebo.nl"><img src="https://avatars.githubusercontent.com/u/54364210?v=4?s=100" width="100px;" alt=""/>
        <br />
        <sub>
          <b>Coen</b>
        </sub>
      </a>
      <br />
      <a href="#design-copebo" title="Design">🎨</a>
      <a href="#content-copebo" title="Content">🖋</a>
      <a href="#userTesting-copebo" title="User Testing">📓</a>
      <a href="#a11y-copebo" title="Accessibility">️️️️♿️</a>
    </td>
    <td align="center">
      <a href="https://github.com/Aidenbuis">
        <img src="https://avatars.githubusercontent.com/u/9105359?v=4?s=100" width="100px;" alt=""/>
        <br />
        <sub>
          <b>Aiden Buis</b>
        </sub>
      </a>
      <br />
      <a href="https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend/commits?author=Aidenbuis" title="Code">💻</a>
      <a href="#a11y-Aidenbuis" title="Accessibility">️️️️♿️</a>
      <a href="https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend/commits?author=Aidenbuis" title="Tests">⚠️</a>
      <a href="https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend/commits?author=Aidenbuis" title="Documentation">📖</a>
    </td>
    <td align="center">
      <a href="https://github.com/Stefwint">
        <img src="https://avatars.githubusercontent.com/u/13415565?v=4?s=100" width="100px;" alt=""/>
        <br />
        <sub>
          <b>Stef Winterswijk</b>
        </sub>
      </a>
      <br />
      <a href="https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend/commits?author=Stefwint" title="Code">💻</a>
      <a href="#a11y-Stefwint" title="Accessibility">️️️️♿️</a>
      <a href="https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend/commits?author=Stefwint" title="Tests">⚠️</a>
      <a href="https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend/commits?author=Stefwint" title="Documentation">📖</a>
    </td>
    <td align="center">
      <a href="https://github.com/Paulien-Wan">
        <img src="https://avatars.githubusercontent.com/u/62105106?v=4?s=100" width="100px;" alt=""/>
        <br />
        <sub>
          <b>Paulien-Wan</b>
        </sub>
      </a>
      <br />
      <a href="https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend/commits?author=Paulien-Wan" title="Tests">⚠️</a>
    </td>
    <td align="center">
      <a href="https://github.com/JasonKAEC">
        <img src="https://avatars.githubusercontent.com/u/74307248?v=4?s=100" width="100px;" alt=""/>
        <br />
        <sub>
          <b>JasonKAEC</b>
        </sub>
      </a>
      <br />
      <a href="https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend/commits?author=JasonKAEC" title="Code">💻</a>
      <a href="#a11y-JasonKAEC" title="Accessibility">️️️️♿️</a>
      <a href="https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend/commits?author=JasonKAEC" title="Tests">⚠️</a>
      <a href="https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend/commits?author=JasonKAEC" title="Documentation">📖</a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/HagenaarC">
        <img src="https://avatars.githubusercontent.com/u/60137925?v=4?s=100" width="100px;" alt=""/>
        <br />
        <sub>
          <b>HagenaarC</b>
        </sub>
      </a>
      <br />
      <a href="#business-HagenaarC" title="Business development">💼</a>
    </td>
    <td align="center">
      <a href="http://freesa.org">
        <img src="https://avatars.githubusercontent.com/u/1174254?v=4?s=100" width="100px;" alt=""/>
        <br />
        <sub>
          <b>Eric Herman</b>
        </sub>
      </a>
      <br />
      <a href="#mentoring-ericherman" title="Mentoring">🧑‍🏫</a>
    </td>
    <td align="center">
      <a href="http://www.linkedin.com/in/bernardvuijk">
        <img src="https://avatars.githubusercontent.com/u/60785505?v=4?s=100" width="100px;" alt=""/>
        <br />
        <sub>
          <b>Bernard Vuijk</b>
        </sub>
      </a>
      <br />
      <a href="#projectManagement-BernardVuijk" title="Project Management">📆</a>
    </td>
    <td align="center">
      <a href="https://github.com/EVerhaar">
        <img src="https://avatars.githubusercontent.com/u/57626563?v=4?s=100" width="100px;" alt=""/>
        <br />
        <sub>
          <b>Erik</b>
        </sub>
      </a>
      <br />
      <a href="#maintenance-EVerhaar" title="Maintenance">🚧</a>
      <a href="#content-EVerhaar" title="Content">🖋</a>
      <a href="#userTesting-EVerhaar" title="User Testing">📓</a>
    </td>
    <td align="center">
      <a href="https://github.com/Swendude">
        <img src="https://avatars.githubusercontent.com/u/2640691?v=4?s=100" width="100px;" alt=""/>
        <br />
        <sub>
          <b>Swen Mulderij</b>
        </sub>
      </a>
      <br />
      <a href="https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend/commits?author=Swendude" title="Code">💻</a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/Kingmar1">
        <img src="https://avatars.githubusercontent.com/u/19493141?v=4?s=100" width="100px;" alt=""/>
        <br />
        <sub>
          <b>Kingmar1</b>
        </sub>
      </a>
      <br />
      <a href="https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend/commits?author=Kingmar1" title="Code">💻</a>
    </td>
    <td align="center">
      <a href="https://github.com/ReadMarten">
        <img src="https://avatars.githubusercontent.com/u/8004997?v=4?s=100" width="100px;" alt=""/>
        <br />
        <sub>
          <b>ReadMarten</b>
        </sub>
      </a>
      <br />
      <a href="#business-ReadMarten" title="Business development">💼</a>
    </td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
