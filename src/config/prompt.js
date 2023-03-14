export async function getPromptModules() {
  const babel = await import("../promptModules/babel.js");
  const router = await import("../promptModules/router.js");
  return [babel, router];
}
