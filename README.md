<img src="https://www.zuid-holland.nl/publish/pages/28722/pzh-basislogo-rgb_export-figma.svg" alt="Provincie Zuid-Holland logo" width="220px">

# Omgevingsbeleid front-end · ![License](https://img.shields.io/github/license/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend)

## Objectives

The Province of South-Holland believes that everyone should be able to easily view its policies. By digitalizing them, the province aims to make its policies more transparant, accesible, current, and informative. This way new initiatives can be carried out faster and better and in turn will result in more coherent policies.
By storing policies in a database instead of in a document, the province also aims to make the proces of creating new or adjusting policies more efficient and in line with the new Dutch standards ([STOP](https://www.koopoverheid.nl/standaarden/stop-standaard)) for publishing governmental plans.

## Application

The application digitalizes the 'physical living environment' policies of the Province of South-Holland. Non authorized users can search policies by text or using a map, see in what area they apply and and view connections between policies. Authorized users can adjust and manage the policies. You can view the roadmap [here](https://www.figma.com/proto/hg7QFPhoCg0juUu3jEdG6w/Omgevingsbeleid-Roadmap?page-id=0%3A1&node-id=1%3A4&viewport=430%2C426%2C0.17213496565818787&scaling=min-zoom&starting-point-node-id=1%3A4).

## Pre-Requisites

-   [Git](https://git-scm.com/)
-   [Node.js](https://nodejs.org/en/)
-   [NPM](https://www.npmjs.com/get-npm)

## Setting up a local version

---

### Clone and install packages

Create a new folder within your documents where you’ll clone the repository to. In Github go to the tab ‘Code’. Click the green button ‘Clone or download’ and copy the link. Using a Terminal, navigate to your recently added folder and run:

```
$ git clone https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend.git
$ cd Omgevingsbeleid-Frontend
$ npm install
```

### Create a .env file

Create a .env file in the root of the project.

```jsx
REACT_APP_API_VERSION = 'v0.1' // Used in the API url (in instance.ts)
REACT_APP_API_ENV = 'dev' // Used in the API url (in instance.ts)
REACT_APP_KEY_API_ACCESS_TOKEN = 'OB_access_token' // Used to set login token
REACT_APP_KEY_IDENTIFIER = 'OB_identifier' // Used to set login identifier
REACT_APP_ERROR_MSG = 'Er is iets misgegaan, probeer het later nog eens' // Error message
```

The following environment variables are not necessary. They are used to initialize the Sentry bug tracker.

```jsx
REACT_APP_SENTRY_DSN = '' // Contains the DSN to track bugs in Sentry
REACT_APP_RELEASE_VERSION = '' // Used to log version in Sentry bugs
```

## Available scripts

---

This runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000/) to view it in the browser. The page will reload if you make edits to the code. You will also see any lint errors in the console.

```
npm start
```

Launches the test runner in the interactive watch mode. See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

```
npm test
```

Runs the Cypress integration tests

```
npm run cy:run
```

Builds the app for production to the **`\*build**`\*\* folder. It correctly bundles React in production mode and optimizes the build for the best performance.

```
npm run build
```

Builds the application just as `npm run build` would do, but also [purges](https://tailwindcss.com/docs/controlling-file-size) the generated Tailwind files. There are two commands to create a build. One for windows `prod:build-win` and one for OSX `prod:build-osx`.

```
npm run prod:build
```

# Source File Structure

---

The project uses the following structure:

-   src
    -   api
    -   App
    -   pages
    -   components
    -   constants
    -   css
    -   fonts
    -   hooks
    -   images
    -   mocks
    -   utils

### src/api

The API folder holds our API Functionality. We use [Axios](https://github.com/axios/axios) as the HTTP client. In the /API folder there are three files for the different API's. It contains:

-   `instance.ts` - Which is our general API
-   `axiosGeoJSON.ts` - Which is our API to connect to the GEO Server
-   `axiosLocatieserver.ts` - Which is our API to connect to PDOK Location server

There are also two generated files which holds all of the endpoints and models. These files are generated using [Orval](https://orval.dev/):

-   `fetchers.ts` - Contains all API endpoints
-   `fetchers.schemas.ts` - Contains all Typescript models

### src/App

Contains the main application component, which contains the sub components and the routing.

### src/pages and src/components

The folder /src contains two main folders for our components. It contains /pages and /components. The /pages folder contains the main files for specific pages. The /components folder contains the universal components. When a component is page specific we place it in the specific /pages/page folder, to not further clutter the /components folder.

Every component sits in its own folder with the name of the component. In the folder there are at least two files:

-   index.ts - importing the ComponentName.tsx and exporting it
-   ComponentName.tsx - Containing the component code

The reason for this approach is so that we can organize our code (and if needed it’s tests) in folders, import from the folder name and not end up with multiple index.ts filenames in our code editor.

### src/constants

This folder contains the constants for our dimensions and

### src/css

For our styling we use [Tailwind](https://tailwindcss.com/) combined with Sass. The CSS folder contains our styles.scss, tailwind.css and tailwind.src.css files. In our tailwind.src.css we define our custom classes which we apply tailwind classes on.

Every component is styled with Tailwind classes, much like Styled Components, but only then with utilities classes.

For when we need to apply specific styling to an element (e.g. calculating a specific width/height for an element) we create a custom class that we style in our styles.scss Sass file.

### src/utils

Contains functions that are used in different components.

### src/hooks

Contains hooks that are used in different components.

### src/images

Contains the images that we use in the front-end, like the Provincie Zuid-Holland logo.

## Testing

---

Static testing is done via ES Lint. Unit testing is done with Jest and React Testing Library. Integration tests are done with [Cypress.io](http://cypress.io). Right now the focus has mostly been on integration tests using [Cypress.io](http://cypress.io), but we want to equal this with more unit tests.

The cypress test right now consists of testing the dimensions, with test to create, read and update the dimensions. These integration test live inside the /cypress folder. Inside we have the /integration folder, which contains the actual tests.

The API calls to the server are all stubbed. They live inside the /fixtures folder. The fixture files are created automatically by setting the `"RECORD"` environmental variable to `true` and then running the test with `npm run cy:run`. After the fixtures have been created you `"RECORD"` back to `false` and the tests will be stubbed.

To set the environmental variable for Cypress you need a `cypress.json` file in the root of your directory. To be able to run authenticated tests you will also need to provide user credentials:

```JSON
{
    "video": false,
    "baseUrl": "http://localhost:3000",
    "env": {
        "env": "dev",
        "RECORD": true,
        "API_VERSION": "api-version",
        "ACCESS_TOKEN": "local-storage-key",
        "USERNAME": "username@domain.com",
        "PASSWORD": "password"
    }
}
```

## JSDoc

---

To install JSDoc Globally to document code use the following steps:

```
npm install -g jsdoc
```

You then create a jsdoc.json config file in the root with the following settings:

-   you can edit the parameters below.

```
{
    "source": {
        "include":["src/pages/", "README.md"],
        "includePattern": ".+\\.js(doc|x)?$",
        "excludePattern": "(node_modules/|docs)"
    },
    "plugins": ["plugins/markdown"],
    "templates": {
        "cleverLinks": true,
        "monospaceLinks": true
    },
    "opts": {
        "recurse": true,
        "destination": "./docs/"
    }
}
```

With the following command you generate/override the doc environment:

```
jsdoc -c jsdoc.json
```

A docs folder will be created (if you didn't have on yet), in that folder you can open the index.html to view the documentation in your browser.

See the following link for tags that can be used in the comments of code/examples: [JSDoc](https://jsdoc.app/index.html)
