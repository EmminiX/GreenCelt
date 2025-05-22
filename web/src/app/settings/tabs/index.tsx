// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// Modifications and enhancements by Emmi C (GreenCeltAI)
// SPDX-License-Identifier: MIT

import { AboutTab } from "./about-tab";
import { GeneralTab } from "./general-tab";
import { MCPTab } from "./mcp-tab";

export const SETTINGS_TABS = [
  {
    ...GeneralTab,
    id: "settings",
    label: "Settings",
    icon: GeneralTab.icon!,
    component: GeneralTab,
  },
  {
    ...MCPTab,
    id: "mcp",
    label: "MCP",
    badge: "Beta",
    icon: MCPTab.icon!,
    component: MCPTab,
  },
  {
    ...AboutTab,
    id: "about",
    label: "About",
    icon: AboutTab.icon!,
    component: AboutTab,
  },
];
