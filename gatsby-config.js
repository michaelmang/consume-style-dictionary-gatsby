// https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/
// See my ".env.example" file that I included
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

const PLATFORM_DELIVERABLE = "css";

module.exports = {
  siteMetadata: {
    title: `Gatsby Default Starter`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@gatsbyjs`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-source-github-api`,
      options: {
        // token: required by the GitHub API
        token: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,

        // GraphQLquery: defaults to a search query
        graphQLQuery: `
          query FetchDesignTokens($owner: String!, $name: String!, $tree: String!) {
            repository(name: $name, owner: $owner) {
              content: object(expression: $tree) {
                ... on Tree {
                  entries {
                    name
                    object {
                      ... on Blob {
                        text
                      }
                    }
                  }
                }
              }
            }
          } 
        `,

        // variables: defaults to variables needed for a search query
        variables: {
          owner: process.env.GITHUB_REPO_OWNER,
          name: process.env.GITHUB_REPO_NAME,
          tree: `${process.env.GITHUB_REPO_BRANCH}:output/${PLATFORM_DELIVERABLE}`,
        },
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
