module.exports = function getPromptModules() {
  return ["babel", "router"].map(file =>
    require(`../promptModules/${file}.js`)
  );
};
