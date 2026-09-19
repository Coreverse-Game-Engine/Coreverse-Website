export type DownloadMode = "launcher" | "editor";

export type OperatingSystem = "windows" | "linux" | "macos";

export type GraphicsApi = "dx11" | "dx12" | "vulkan" | "opengl" | "metal";

export type OsOption = {
  value: OperatingSystem;
  image: string;
  labelKey: string;
};

export const operatingSystems: readonly OsOption[] = [
  { value: "windows", image: "/images/Windows-Logo.svg", labelKey: "windows" },
  { value: "linux", image: "/images/Linux-Logo.svg", labelKey: "linux" },
  { value: "macos", image: "/images/Apple-Logo.svg", labelKey: "macos" },
];

// Which graphics APIs are offered for each operating system -- the Editor
// flow's graphics step filters down to this list once an OS is picked.
export const graphicsApisByOs: Record<OperatingSystem, readonly GraphicsApi[]> = {
  windows: ["dx11", "dx12", "vulkan", "opengl"],
  linux: ["vulkan", "opengl"],
  macos: ["metal"],
};

export type GraphicsApiOption = {
  value: GraphicsApi;
  labelKey: string;
} & ({ kind: "image"; image: string } | { kind: "badge" });

// Vulkan and OpenGL keep their existing logo images; the newly-added APIs
// (DX11, DX12, Metal) render as readable text badges instead of pulling in
// external logo assets.
export const graphicsApiOptions: Record<GraphicsApi, GraphicsApiOption> = {
  vulkan: { value: "vulkan", labelKey: "vulkan", kind: "image", image: "/images/Vulkan-Logo.svg" },
  opengl: { value: "opengl", labelKey: "opengl", kind: "image", image: "/images/OpenGL-Logo.svg" },
  dx11: { value: "dx11", labelKey: "dx11", kind: "badge" },
  dx12: { value: "dx12", labelKey: "dx12", kind: "badge" },
  metal: { value: "metal", labelKey: "metal", kind: "badge" },
};

// Short glyph shown inside a text badge -- kept distinct per API so the
// badges are visually distinguishable from each other and from the
// Vulkan/OpenGL logo tiles at a glance.
export const graphicsApiBadgeGlyph: Record<GraphicsApi, string> = {
  dx11: "DX11",
  dx12: "DX12",
  metal: "MTL",
  vulkan: "",
  opengl: "",
};
