# Omgevingsbeleid-Frontend and the Standard for Public Code version 0.4.0

<!-- SPDX-License-Identifier: CC0-1.0 -->
<!-- generated 2022 by The Foundation for Public Code <info@publiccode.net> -->

Link to commitment to meet the Standard for Public Code:

## [Code in the open](https://standard.publiccode.net/criteria/code-in-the-open.html)

- [x] criterion met.

Requirement | meets | &nbsp;links&nbsp;and&nbsp;notes&nbsp;
-----|-----|-----
All source code for any policy in use (unless used for fraud detection) MUST be published and publicly accessible. | n/a  | Policy logic is handle in the backend
All source code for any software in use (unless used for fraud detection) MUST be published and publicly accessible. | yes | [GitHub](https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend)
Contributors MUST NOT upload sensitive information regarding users, their organization or third parties to the repository. | yes | Add to the Contributing file
Any source code not currently in use (such as new versions, proposals or older versions) SHOULD be published. | yes | [GitHub](https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend)
Documenting which source code or policy underpins any specific interaction the general public may have with an organization is OPTIONAL. | n/a | Fits more into the documentation of the backend and its business logic

## [Bundle policy and source code](https://standard.publiccode.net/criteria/bundle-policy-and-code.html)

- [x] criterion met.

Requirement | meets | &nbsp;links&nbsp;and&nbsp;notes&nbsp;
-----|-----|-----
A codebase MUST include the policy that the source code is based on. | n/a | A better place for this would be the back-end codebase. See the [backend](https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-API)
A codebase MUST include all source code that the policy is based on, unless used for fraud detection. | n/a |
Policy SHOULD be provided in machine readable and unambiguous formats. | n/a |
Continuous integration tests SHOULD validate that the source code and the policy are executed coherently. | yes | Tests runs on open PR's

## [Create reusable and portable code](https://standard.publiccode.net/criteria/reusable-and-portable-codebases.html)

- [ ] criterion met.

Requirement | meets | &nbsp;links&nbsp;and&nbsp;notes&nbsp;
-----|-----|-----
The codebase MUST be developed to be reusable in different contexts. | yes | Codebase components can be reused
The codebase MUST be independent from any secret, undisclosed, proprietary or non-open licensed code or services for execution and understanding. | yes |
The codebase SHOULD be in use by multiple parties. |  | Only one party so far
The roadmap SHOULD be influenced by the needs of multiple parties. |  | Only one party so far
Configuration SHOULD be used to make code adapt to context specific needs. | yes | CRUD part of application is configurable
The codebase SHOULD be localizable. |  |
Code and its documentation SHOULD NOT contain situation-specific information. | yes |
Codebase modules SHOULD be documented in such a way as to enable reuse in codebases in other contexts. | yes |

## [Welcome contributors](https://standard.publiccode.net/criteria/open-to-contributions.html)

- [ ] criterion met.

Requirement | meets | &nbsp;links&nbsp;and&nbsp;notes&nbsp;
-----|-----|-----
The codebase MUST allow anyone to submit suggestions for changes to the codebase. | yes | Forks and pull requests are open
The codebase MUST include contribution guidelines explaining what kinds of contributions are welcome and how contributors can get involved, for example in a `CONTRIBUTING` file. | yes | [CONTRIBUTING.md](CONTRIBUTING.md)
The codebase MUST document the governance of the codebase, contributions and its community, for example in a `GOVERNANCE` file. |  | No GOVERNANCE file yet
The codebase SHOULD advertise the committed engagement of involved organizations in the development and maintenance. | yes | Right now it is clear that the only organization is PZH. When there will be others they will be added.
The codebase SHOULD have a publicly available roadmap. | yes | Roadmap is linked from the [README](README.md).
The codebase SHOULD publish codebase activity statistics. | yes | [GitHub pulse](https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend/pulse)
Including a code of conduct for contributors in the codebase is OPTIONAL. |  | No code of conduct yet

## [Make contributing easy](https://standard.publiccode.net/criteria/make-contributing-easy.html)

- [ ] criterion met.

Requirement | meets | &nbsp;links&nbsp;and&nbsp;notes&nbsp;
-----|-----|-----
The codebase MUST have a public issue tracker that accepts suggestions from anyone. | yes | [Issues](https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend/issues)
The codebase MUST include instructions for how to privately report security issues for responsible disclosure. |  |
The documentation MUST link to both the public issue tracker and submitted codebase changes, for example in a `README` file. | yes | [Issues](https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend/issues), [Pull requests](https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend/pulls)
The codebase MUST have communication channels for users and developers, for example email lists. | yes | [Email List](https://lists.publiccode.net/mailman/postorius/lists/omgevingsbeleid-discuss.lists.publiccode.net/)
The documentation SHOULD include instructions for how to report potentially security sensitive issues on a closed channel. |  | No direct instructions yet

## [Maintain version control](https://standard.publiccode.net/criteria/version-control-and-history.html)

- [x] criterion met.

Requirement | meets | &nbsp;links&nbsp;and&nbsp;notes&nbsp;
-----|-----|-----
The community MUST have a way to maintain version control for the code. | yes | [Git](https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend)
All files in a codebase MUST be version controlled. | yes |
All decisions MUST be documented in commit messages. | yes |
Every commit message MUST link to discussions and issues wherever possible. | yes | Including visual indicators using [Gitmoji](https://gitmoji.dev/)
The codebase SHOULD be maintained in a distributed version control system. | Yes | [Git](https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend)
Contributors SHOULD group relevant changes in commits. | yes | Will be added to CONTRIBUTING
Maintainers SHOULD mark released versions of the codebase, for example using revision tags or textual labels. | yes | Started tagging release versions
Contributors SHOULD prefer file formats where the changes within the files can be easily viewed and understood in the version control system. | yes |
It is OPTIONAL for contributors to sign their commits and provide an email address, so that future contributors are able to contact past contributors with questions about their work. | yes |

## [Require review of contributions](https://standard.publiccode.net/criteria/require-review.html)

- [ ] criterion met.

Requirement | meets | &nbsp;links&nbsp;and&nbsp;notes&nbsp;
-----|-----|-----
All contributions that are accepted or committed to release versions of the codebase MUST be reviewed by another contributor. | yes |
Reviews MUST include source, policy, tests and documentation. | yes |
Reviewers MUST provide feedback on all decisions to not accept a contribution. | yes |
Contributions SHOULD conform to the standards, architecture and decisions set out in the codebase in order to pass review. | yes |
Reviews SHOULD include running both the code and the tests of the codebase. | yes |
Contributions SHOULD be reviewed by someone in a different context than the contributor. | yes |
Version control systems SHOULD NOT accept non-reviewed contributions in release versions. |  | Not setup yet
Reviews SHOULD happen within two business days. |  | Team is too small
Performing reviews by multiple reviewers is OPTIONAL. |  | Team is too small for multiple reviewers

## [Document codebase objectives](https://standard.publiccode.net/criteria/document-objectives.html)

- [x] criterion met.

Requirement | meets | &nbsp;links&nbsp;and&nbsp;notes&nbsp;
-----|-----|-----
The codebase MUST contain documentation of its objectives, like a mission and goal statement, that is understandable by developers and designers so that they can use or contribute to the codebase. | yes | [README](README.md#Objectives)
Codebase documentation SHOULD clearly describe the connections between policy objectives and codebase objectives. | yes | [README](README.md#Application)
Documenting the objectives of the codebase for the general public is OPTIONAL. | yes | [README](README.md#Objectives)

## [Document the code](https://standard.publiccode.net/criteria/documenting.html)

- [ ] criterion met.

Requirement | meets | &nbsp;links&nbsp;and&nbsp;notes&nbsp;
-----|-----|-----
All of the functionality of the codebase, policy as well as source, MUST be described in language clearly understandable for those that understand the purpose of the code. | yes | Code is documented where necessary
The documentation of the codebase MUST contain a description of how to install and run the source code. | yes | [README](README.md)
The documentation of the codebase MUST contain examples demonstrating the key functionality. |  |
The documentation of the codebase SHOULD contain a high level description that is clearly understandable for a wide audience of stakeholders, like the general public and journalists. | yes | [README](README.md)
The documentation of the codebase SHOULD contain a section describing how to install and run a standalone version of the source code, including, if necessary, a test dataset. | yes | [README](README.md)
The documentation of the codebase SHOULD contain examples for all functionality. |  |
The documentation SHOULD describe the key components or modules of the codebase and their relationships, for example as a high level architectural diagram. |  |
There SHOULD be continuous integration tests for the quality of the documentation. |  |
Including examples that make users want to immediately start using the codebase in the documentation of the codebase is OPTIONAL. | yes | The codebase right now is based on the usecase for the PZH, so it is filled with 'examples'.
Testing the code by using examples in the documentation is OPTIONAL. |  |

## [Use plain English](https://standard.publiccode.net/criteria/understandable-english-first.html)

- [ ] criterion met.

Requirement | meets | &nbsp;links&nbsp;and&nbsp;notes&nbsp;
-----|-----|-----
All codebase documentation MUST be in English. | yes |
All code MUST be in English, except where policy is machine interpreted as code. | yes | The API is build around domain specific objects which are used in Dutch, rest of the code is in English
All bundled policy not available in English MUST have an accompanying summary in English. | n/a  | Policy is handled in the backend
Any translation MUST be up to date with the English version and vice versa. | n/a | No translation
There SHOULD be no acronyms, abbreviations, puns or legal/non-English/domain specific terms in the codebase without an explanation preceding it or a link to an explanation. |  | Terms should be better documentated
The name of the codebase SHOULD be descriptive and free from acronyms, abbreviations, puns or organizational branding. | yes |
Documentation SHOULD aim for a lower secondary education reading level, as recommended by the [Web Content Accessibility Guidelines 2](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=315#readable). |  | Documentation is written in most simple form, but this is not tested
Providing a translation of any code, documentation or tests is OPTIONAL. | n/a | No translation

## [Use open standards](https://standard.publiccode.net/criteria/open-standards.html)

- [x] criterion met.

Requirement | meets | &nbsp;links&nbsp;and&nbsp;notes&nbsp;
-----|-----|-----
For features of a codebase that facilitate the exchange of data the codebase MUST use an open standard that meets the [Open Source Initiative Open Standard Requirements](https://opensource.org/osr). | yes | We are not using closed standards
Any non-open standards used MUST be recorded clearly as such in the documentation. | n/a |
Any standard chosen for use within the codebase MUST be listed in the documentation with a link to where it is available. | n/a | No standards specifically chosen for the frontend
Any non-open standards chosen for use within the codebase MUST NOT hinder collaboration and reuse. | n/a |
If no existing open standard is available, effort SHOULD be put into developing one. | n/a | No effort into developing one
Standards that are machine testable SHOULD be preferred over those that are not. | n/a |

## [Use continuous integration](https://standard.publiccode.net/criteria/continuous-integration.html)

- [ ] criterion met.

Requirement | meets | &nbsp;links&nbsp;and&nbsp;notes&nbsp;
-----|-----|-----
All functionality in the source code MUST have automated tests. | yes |
Contributions MUST pass all automated tests before they are admitted into the codebase. | yes |
The codebase MUST have guidelines explaining how to structure contributions. |  | Expand CONTRIBUTING
The codebase MUST have active contributors. | yes | Currently the omgevingsbeleid team
The codebase guidelines SHOULD state that each contribution should focus on a single issue. |  | Expand CONTRIBUTING
Source code test and documentation coverage SHOULD be monitored. | yes | Coverage is outputteed in PR's
Testing policy and documentation for consistency with the source and vice versa is OPTIONAL. |  |
Testing policy and documentation for style and broken links is OPTIONAL. |  |

## [Publish with an open license](https://standard.publiccode.net/criteria/open-licenses.html)

- [ ] criterion met.

Requirement | meets | &nbsp;links&nbsp;and&nbsp;notes&nbsp;
-----|-----|-----
All code and documentation MUST be licensed such that it may be freely reusable, changeable and redistributable. | yes | [EUPL-1.2](LICENSE.md)
Software source code MUST be licensed under an [OSI-approved or FSF Free/Libre license](https://spdx.org/licenses/). | yes | [EUPL-1.2](LICENSE.md)
All code MUST be published with a license file. | yes |
Contributors MUST NOT be required to transfer copyright of their contributions to the codebase. | yes |
All source code files in the codebase SHOULD include a copyright notice and a license header that are machine-readable. |  | TODO: write script and add.
Having multiple licenses for different types of code and documentation is OPTIONAL. |  |

## [Make the codebase findable](https://standard.publiccode.net/criteria/findability.html)

- [ ] criterion met.

Requirement | meets | &nbsp;links&nbsp;and&nbsp;notes&nbsp;
-----|-----|-----
The codebase MUST be findable using a search engine by describing the problem it solves in natural language. |  | <!-- need to check with team -->
The codebase MUST be findable using a search engine by codebase name. |  | Codebase not linked from releases or main site
Maintainers SHOULD submit the codebase to relevant software catalogs. |  | <!-- need to check -->
The codebase SHOULD have a website which describes the problem the codebase solves using the preferred jargon of different potential users of the codebase (including technologists, policy experts and managers). |  |
The codebase SHOULD have a unique and persistent identifier where the entry mentions the major contributors, repository location and website. |  |
The codebase SHOULD include a machine-readable metadata description, for example in a [publiccode.yml](https://github.com/publiccodeyml/publiccode.yml) file. | yes | [publiccode.yml](publiccode.yml)
A dedicated domain name for the codebase is OPTIONAL. |  |
Regular presentations at conferences by the community are OPTIONAL. |  |

## [Use a coherent style](https://standard.publiccode.net/criteria/style.html)

- [ ] criterion met.

Requirement | meets | &nbsp;links&nbsp;and&nbsp;notes&nbsp;
-----|-----|-----
Contributions MUST adhere to either a coding or writing style guide, either the codebase community's own or an existing one that is advertised in or part of the codebase. |  | We use Prettier with a [default configuration](https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend/blob/dev/.prettierrc), add to guidelines
Contributions SHOULD pass automated tests on style. | yes | Prettier keeps this consistent. No guidelines yet.
The codebase SHOULD include inline comments and documentation for non-trivial sections. | yes |
Including sections on [understandable English](https://standard.publiccode.net/criteria/understandable-english-first.html) in the style guide is OPTIONAL. | yes | Glossary started

## [Document codebase maturity](https://standard.publiccode.net/criteria/document-maturity.html)

- [ ] criterion met.

Requirement | meets | &nbsp;links&nbsp;and&nbsp;notes&nbsp;
-----|-----|-----
A codebase MUST be versioned. | yes | Using semver
A codebase that is ready to use MUST only depend on other codebases that are also ready to use. | yes | We do not use any major packages that are in beta / alpha
A codebase that is not yet ready to use MUST have one of the labels: prototype, alpha, beta or pre-release version. | n/a |
A codebase SHOULD contain a log of changes from version to version, for example in the `CHANGELOG`. |  | [Changelog](https://omgevingsbeleid.zuid-holland.nl/planning-en-releases), Tag 1.0 in GitHub

