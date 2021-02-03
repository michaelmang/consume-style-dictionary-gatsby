/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

function getTokensFromText(text) {
  const cssVariableMatcher = /--.+: .+/g
  const result = text.match(cssVariableMatcher)
  const keyMatcher = /--.+(?=:)/gm
  const everythingButValueMatcher = /--.+:/gm
  return result.map(cssVariable => ({
    key: cssVariable.match(keyMatcher)[0],
    value: cssVariable
      .replace(everythingButValueMatcher, "")
      .replace(";", "")
      .trim(),
  }))
}

// I based this off an existing Gatsby transformer plugin: https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-transformer-yaml/src/gatsby-node.js
exports.onCreateNode = ({
  node,
  actions,
  createNodeId,
  createContentDigest,
}) => {
  const { createNode, createParentChildLink } = actions
  if (node.internal.owner === "gatsby-source-github-api") {
    const platformDeliverable = node.data.repository.content.entries[0]
    const tokens = getTokensFromText(platformDeliverable.object.text)

    tokens.forEach(token => {
      const tokenNode = {
        ...token,
        id: createNodeId(token.key),
        children: [],
        parent: node.id,
        internal: {
          contentDigest: createContentDigest(token),
          type: "TokenData",
        },
      }

      createNode(tokenNode)
      createParentChildLink({ parent: node, child: tokenNode })
    })
  }
}
