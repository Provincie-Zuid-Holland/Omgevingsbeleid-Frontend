# Omgevingsbeleid-Frontend and the Standard for Public Code

## [Code in the Open](https://standard.publiccode.net/criteria/code-in-the-open.html)

-   [x] compliant with this criterion.

| Requirement                                                                                                                                                       | meets | links and notes                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ---------------------------------------------------------------------------- |
| All source code for any policy and software in use (unless used for fraud detection) MUST be published and publicly accessible.                                   | yes   | [Github](https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend) |
| Contributors MUST NOT upload sensitive information regarding users, their organization or third parties to the repository.                                        | yes   | Add to the Contributing file                                                 |
| Any source code not currently in use (such as new versions, proposals or older versions) SHOULD be published.                                                     | yes   | [Github](https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend) |
| The source code MAY provide the general public with insight into which source code or policy underpins any specific interaction they have with your organization. | n/a   | Fits more into the documentation of the backend and its business logic       |

## [Bundle policy and source code](https://standard.publiccode.net/criteria/bundle-policy-and-code.html)

-   [x] compliant with this criterion.

| Requirement                                                                                               | meets | links and notes                                                                                                                          |
| --------------------------------------------------------------------------------------------------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| A codebase MUST include the policy that the source code is based on.                                      | n/a   | A better place for this would be the back-end codebase. See the [backend](https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-API) |
| A codebase MUST include all source code that the policy is based on.                                      | n/a   |
| All policy and source code that the codebase is based on MUST be documented, reusable and portable.       | n/a   | See the [Backend](https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-API)                                                         |
| Policy SHOULD be provided in machine readable and unambiguous formats.                                    | n/a   |
| Continuous integration tests SHOULD validate that the source code and the policy are executed coherently. | Yes   | Tests runs on open PR's                                                                                                                  |

## [Create reusable and portable code](https://standard.publiccode.net/criteria/reusable-and-portable-codebases.html)

-   [x] compliant with this criterion.

| Requirement                                                                                                                                       | meets | links and notes                          |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ---------------------------------------- |
| The codebase MUST be developed to be reusable in different contexts.                                                                              | yes   | Codebase components can be reused        |
| The codebase MUST be independent from any secret, undisclosed, proprietary or non-open licensed code or services for execution and understanding. | yes   |
| The codebase SHOULD be in use by multiple parties.                                                                                                | n/a   | Only one party so far                    |
| The roadmap SHOULD be influenced by the needs of multiple parties.                                                                                | n/a   | Only one party so far                    |
| Configuration SHOULD be used to make code adapt to context specific needs.                                                                        | yes   | CRUD part of application is configurable |
| Codebases SHOULD include a publiccode.yml metadata description so that they’re easily discoverable.                                               | yes   |
| Code and its documentation SHOULD NOT contain situation-specific information.                                                                     | yes   |

## [Welcome contributors](https://standard.publiccode.net/criteria/open-to-contributions.html)

-   [ ] compliant with this criterion.

| Requirement                                                                                                                         | meets | links and notes                                                                                                                 |
| ----------------------------------------------------------------------------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------- |
| The codebase MUST allow anyone to submit suggestions for changes to the codebase.                                                   | Yes   | Forks and pull requests are open                                                                                                |
| The codebase MUST include contribution guidelines explaining how contributors can get involved, for example in a CONTRIBUTING file. | yes   |
| The codebase SHOULD advertise the committed engagement of involved organizations in the development and maintenance.                | Yes   | Right now it is clear that the only organization is PZH. When there will be others they will be added.                          |
| The codebase SHOULD document the governance of the codebase, contributions and its community, for example in a GOVERNANCE file.     | No    | No GOVERNANCE file yet                                                                                                          |
| The codebase SHOULD have a publicly available roadmap.                                                                              | Yes   | [Roadmap](https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend/blob/master/README.md) is mentioned in the Readme. |
| The codebase MAY include a code of conduct for contributors.                                                                        | No    | No code of conduct yet                                                                                                          |

## [Make contributing easy](https://standard.publiccode.net/criteria/make-contributing-easy.html)

-   [ ] compliant with this criterion.

| Requirement                                                                                                                | meets | links and notes                                                                            |
| -------------------------------------------------------------------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------ |
| The codebase MUST have a public issue tracker that accepts suggestions from anyone.                                        | Yes   | [Issue Tracker](https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend/issues) |
| The codebase MUST include an email address for security issues and responsible disclosure.                                 | Yes   | Located in the 'authors' file                                                              |
| The documentation MUST link to both the public issue tracker and submitted codebase changes, for example in a README file. | No    | Not yet in the README file                                                                 |
| The project MUST have communication channels for users and developers, for example email lists.                            | Yes   | Email List                                                                                 |
| The documentation SHOULD include instructions for how to report potentially security sensitive issues on a closed channel. | No    | No direct instructions yet                                                                 |

## [Maintain version control](https://standard.publiccode.net/criteria/version-control-and-history.html)

-   [x] compliant with this criterion.

| Requirement                                                                                            | meets | links and notes                                                              |
| ------------------------------------------------------------------------------------------------------ | ----- | ---------------------------------------------------------------------------- |
| You MUST have a way to maintain version control for the code.                                          | Yes   | [Github](https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend) |
| All files in a codebase MUST be version controlled.                                                    | Yes   |
| All decisions MUST be documented in commit messages.                                                   | Yes   | Including visual indicators using [Gitmoji](https://gitmoji.dev/)            |
| Every commit message MUST link to discussions and issues wherever possible.                            | Yes   | Public and non-public issues are tagged in commits.                          |
| You SHOULD mark different versions of the codebase, for example using revision tags or textual labels. | Yes   | Started tagging release versions                                             |
| You SHOULD prefer file formats that can easily be version controlled.                                  | Yes   |

## [Require review of contributions](https://standard.publiccode.net/criteria/require-review.html)

-   [ ] compliant with this criterion.

| Requirement                                                                                                                   | meets | links and notes                          |
| ----------------------------------------------------------------------------------------------------------------------------- | ----- | ---------------------------------------- |
| All contributions that are accepted or committed to release versions of the codebase MUST be reviewed by another contributor. | Yes   |
| Reviews MUST include source, policy, tests and documentation.                                                                 | Yes   |
| Reviewers MUST provide feedback on all decisions made and the implementation in the review.                                   | yes   |
| Contributions SHOULD conform to the standards, architecture and decisions set out in the codebase in order to pass review.    | Yes   |
| Reviews SHOULD include running both the code and the tests of the codebase.                                                   | yes   |
| Contributions SHOULD be reviewed by someone in a different context than the contributor.                                      | yes   |
| Version control systems SHOULD not accept non-reviewed contributions in release versions.                                     | No    | Not setup yet                            |
| Reviews SHOULD happen within two business days.                                                                               | n/a   | Team is too small                        |
| Reviews MAY be performed by multiple reviewers.                                                                               | n/a   | Team is too small for multiple reviewers |

## [Document your objectives](https://standard.publiccode.net/criteria/document-objectives.html)

-   [ ] compliant with this criterion.

| Requirement                                                                                                                                                                                            | meets | links and notes                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- | -------------------------------------------------------------------------------------------------------------------------------- |
| The codebase MUST contain documentation of its objectives – like a mission and goal statement – that is understandable by designers and developers so that they can use or contribute to the codebase. | Yes   | [The commit](https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend/commit/ed08d7d27527a526a33ec4cdd4a3649136e41651) |
| The codebase SHOULD contain documentation of its objectives understandable by policy makers and management.                                                                                            | Yes   | [The commit](https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend/commit/ed08d7d27527a526a33ec4cdd4a3649136e41651) |
| The codebase MAY contain documentation of its objectives for the general public.                                                                                                                       | Yes   | [The commit](https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend/commit/ed08d7d27527a526a33ec4cdd4a3649136e41651) |

## [Document your code](https://standard.publiccode.net/criteria/documenting.html)

-   [x] compliant with this criterion.

| Requirement                                                                                                                                                                                                                                                                                                                                           | meets | links and notes                                                                                                                                                                               |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| All of the functionality of the codebase – policy as well as source – MUST be described in language clearly understandable for those that understand the purpose of the code.                                                                                                                                                                         | Yes   | Code is documented where necessary                                                                                                                                                            |
| The documentation of the codebase MUST contain: a description of how to install and run the source code, examples demonstrating the key functionality.                                                                                                                                                                                                | Yes   | See the [readme](https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend)                                                                                                          |
| The documentation of the codebase SHOULD contain: a high level description that is clearly understandable for a wide audience of stakeholders, like the general public and journalists, a section describing how to install and run a standalone version of the source code, including, if necessary, a test dataset, examples for all functionality. | Yes   | The Readme.md contains everything needed to setup the frontend. Could be improved in the future with documentation of the key terms and the dependency of the API, and how to set the API up. |
| There SHOULD be continuous integration tests for the quality of your documentation.                                                                                                                                                                                                                                                                   | Yes   | CI is setup                                                                                                                                                                                   |
| The documentation of the codebase MAY contain examples that make users want to immediately start using the codebase.                                                                                                                                                                                                                                  | Yes   | The codebase right now is based on the usecase for the PZH, so it is filled with 'examples'.                                                                                                  |
| You MAY use the examples in your documentation to test the code.                                                                                                                                                                                                                                                                                      | Yes   | The                                                                                                                                                                                           |

## [Use plain English](https://standard.publiccode.net/criteria/understandable-english-first.html)

-   [x] compliant with this criterion.

| Requirement                                                                                                                                                      | meets | links and notes                                                                                         |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------- |
| All code and documentation MUST be in English.                                                                                                                   | Yes   | The API is build around domain specific objects which are used in Dutch, rest of the code is in English |
| Any translation MUST be up to date with the English version and vice versa.                                                                                      | n/a   | No translation                                                                                          |
| There SHOULD be no acronyms, abbreviations, puns or legal/domain specific terms in the codebase without an explanation preceding it or a link to an explanation. | No    | Terms should be better documentated                                                                     |
| The name of the project or codebase SHOULD be descriptive and free from acronyms, abbreviations, puns or branding.                                               | Yes   |
| Documentation SHOULD aim for a lower secondary education reading level, as recommended by the Web Content Accessibility Guidelines 2.                            | n/a   | Documentation is written in most simple form, but this is not tested                                    |
| Any code, documentation and tests MAY have a translation.                                                                                                        | n/a   | No translation                                                                                          |

## [Use open standards](https://standard.publiccode.net/criteria/open-standards.html)

-   [ ] compliant with this criterion.

| Requirement                                                                                                                                                                                                   | meets | links and notes                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ---------------------------------- |
| For features of a codebase that facilitate the exchange of data the codebase MUST use an open standard that meets the Open Source Initiative Open Standard Requirements.                                      | Yes   | We are not using closed standards. |
| If no existing open standard is available, effort SHOULD be put into developing one.                                                                                                                          | n/a   | No effort into developing one      |
| Standards that are machine testable SHOULD be preferred over those that are not.                                                                                                                              | n/a   |
| Functionality using features from a non-open standard (one that doesn’t meet the Open Source Initiative Open Standard Requirements) MAY be provided if necessary, but only in addition to compliant features. | n/a   |
| All non-compliant standards used MUST be recorded clearly in the documentation.                                                                                                                               | n/a   |
| The codebase SHOULD contain a list of all the standards used with links to where they are available.                                                                                                          | n/a   |

## [Use continuous integration](https://standard.publiccode.net/criteria/continuous-integration.html)

-   [x] compliant with this criterion.

| Requirement                                                                               | meets | links and notes                                                                                     |
| ----------------------------------------------------------------------------------------- | ----- | --------------------------------------------------------------------------------------------------- |
| All functionality in the source code MUST have automated tests.                           | Yes   |
| Contributions MUST pass all automated tests before they are admitted into the codebase.   | Yes   |
| Contributions MUST be small.                                                              | Yes   | Normally they are quite small and focussed. But sometimes they include a merge of a feature branch. |
| The codebase MUST have active contributors.                                               | Yes   | Currently the omgevingsbeleid team                                                                  |
| Source code test and documentation coverage SHOULD be monitored.                          | Yes   | Coverage is outputteed in PR's                                                                      |
| Policy and documentation MAY have testing for consistency with the source and vice versa. | n/a   |
| Policy and documentation MAY have testing for style and broken links.                     | n/a   |

## [Publish with an open license](https://standard.publiccode.net/criteria/open-licenses.html)

-   [ ] compliant with this criterion.

| Requirement                                                                                                      | meets | links and notes                                           |
| ---------------------------------------------------------------------------------------------------------------- | ----- | --------------------------------------------------------- |
| All code and documentation MUST be licensed such that it may be freely reusable, changeable and redistributable. | Yes   | EUPL-1.2 License                                          |
| Software source code MUST be licensed under an OSI-approved open source license.                                 | Yes   | [See this link](https://opensource.org/licenses/EUPL-1.2) |
| All code MUST be published with a license file.                                                                  | Yes   | [See this file](https://opensource.org/licenses/EUPL-1.2) |
| Contributors MUST NOT be required to transfer copyright of their contributions to the codebase.                  | Yes   |
| All source code files in the codebase SHOULD include a copyright notice and a license header.                    | No    | TODO: write script and add.                               |
| Codebases MAY have multiple licenses for different types of code and documentation.                              | n/a   |

## [Use a coherent style](https://standard.publiccode.net/criteria/style.html)

-   [x] compliant with this criterion.

| Requirement                                                                                                                                            | meets | links and notes                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Contributions MUST adhere to either a coding or writing style guide, either your own or an existing one that is advertised in or part of the codebase. | Yes   | We use Prettier with a [default configuration](https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend/blob/dev/.prettierrc) |
| Contributions SHOULD pass automated tests on style.                                                                                                    | yes   | Prettier keeps this consistent. No guidelines yet.                                                                                      |
| Your codebase SHOULD include inline comments and documentation for non-trivial sections.                                                               | Yes   |
| You MAY include sections in your style guide on understandable English.                                                                                | Yes   | Glossary started                                                                                                                        |

## [Document codebase maturity](https://standard.publiccode.net/criteria/document-maturity.html)

-   [x] compliant with this criterion.

| Requirement                                                                                                                                                                                                                                                                                                                                                                                                                                                         | meets | links and notes                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | --------------------------------------------------------- |
| A codebase MUST be versioned.                                                                                                                                                                                                                                                                                                                                                                                                                                       | Yes   | Using semver                                              |
| A codebase that is ready to use MUST only depend on other codebases that are also ready to use.                                                                                                                                                                                                                                                                                                                                                                     | Yes   | We do not use any major packages that are in beta / alpha |
| A codebase that is not yet ready to use MUST have one of these labels: prototype - to test the look and feel, and to internally prove the concept of the technical possibilities, alpha - to do guided tests with a limited set of users, beta - to open up testing to a larger section of the general public, for example to test if the codebase works at scale, pre-release version - code that is ready to be released but hasn’t received formal approval yet. | n/a   |
| A codebase SHOULD contain a log of changes from version to version, for example in the CHANGELOG.                                                                                                                                                                                                                                                                                                                                                                   | Yes   |
