# Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Pre-Requisites
- Git
- Clone of the repository
- Node.js
- NPM packages

#### Git
Go to [https://git-scm.com/](https://git-scm.com/) to install Git.

#### Clone of the repository
Create a new folder within your documents where you'll clone the repository to. In Github go to the tab 'Code'.
Click the green button 'Clone or download' and copy the link. 
Using a Terminal (opdrachtprompt), go to your recently added folder and run:

    git clone <link>

The code has now been cloned to your folder.

#### Node.js
Go to [https://nodejs.org/en/](https://nodejs.org/en/) and download the installer fit for your operating system. 
To see if Node is installed, type node -v in the Terminal. If you receive the version number then Node is correctly installed.

#### NPM packages
Go to the folder where you cloned the repository to in the Terminal. To install the NPM packages, run:

    pip install npm

To see if NPM is installed, type npm -v in Terminal.
Now you are ready to set up a local version of the project.

## Setting up a local version
To run this project locally and to be able to make changes you need to be able to do the following:
- Run npm

#### Run npm
Go to your created folder (project directory) using the commandprompt. Here you can run:

    npm start
  
This runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits to the code. You will also see any lint errors in the console. 

    npm test

Launches the test runner in the interactive watch mode. See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

    npm run build

Builds the app for production to the **`**build**`** folder. It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes.

# File Structure

-   src
    -   pages
    -   components
    -   API
    -   css
    -   images

## Pages & Components

The folder /src contains two main folders for our components. It contains /pages and /components. The /pages folder contains the main files for specific pages. The /components folder contains the universal components. When a component is page specific we place it in the specific /pages/page folder, to not further clutter the /components folder.

Every component sits in its own folder with the name of the component. In the folder there are at least two files:

-   index.js - importing the ComponentName.js and exporting it
-   ComponentName.js - Containing the component code

The reason for this approach is so that we can organize our code (and if needed it's tests) in folders, import from the folder name and not end up with multiple index.js filenames in our code editor.

## API

The API folder holds our Datamodel and our API Functionality (with [Axios](https://github.com/axios/axios) as the HTTP client). Our datamodel is a JSON file containing the structure of every object the front-end needs to process. For every property on the objects the Datamodel defines if the user can perfom CRUD actions on it. These values are used to build the front-end view for the user. It also defines various variables like the object singular and plural names which we use in the front-end.

## CSS

For our styling we use [Tailwind](https://tailwindcss.com) combined with Sass. The CSS folder contains our styles.scss, tailwind.css and tailwind.src.css files. In our tailwind.src.css we define our custom classes which we apply tailwind classes on.

Every component is styled with Tailwind classes, much like Styled Components, but only then with utilities classes.

For when we need to apply specific styling to an element (e.g. calculating a specific width/height for an element) we create a custom class that we style in our styles.scss Sass file.

## Images

Contains the images that we use in the front-end, like the Provincie Zuid-Holland logo.
