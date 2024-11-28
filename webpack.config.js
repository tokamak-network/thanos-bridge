module: {
  rules: [
    {
      test: /\.js$/,
      enforce: 'pre',
      use: ['source-map-loader'],
      exclude: [
        /node_modules[\\/]@metamask/,  // Specifically exclude MetaMask SDK
        /\.map$/,
        /node_modules[\\/](?!@your-included-packages)/ // Exclude other node_modules but keep specific ones if needed
      ]
    }
  ]
}