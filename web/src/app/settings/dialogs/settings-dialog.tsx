// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// Modifications and enhancements by Emmi C (GreenCeltAI)
// SPDX-License-Identifier: MIT

import { Settings } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import React from "react";

import { Tooltip } from "~/components/deer-flow/tooltip";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Tabs, TabsContent } from "~/components/ui/tabs";
import { useReplay } from "~/core/replay";
import {
  type SettingsState,
  changeSettings,
  saveSettings,
  useSettingsStore,
} from "~/core/store";
import { cn } from "~/lib/utils";

import { SETTINGS_TABS } from "../tabs";

export function SettingsDialog() {
  const { isReplay } = useReplay();
  const [activeTabId, setActiveTabId] = useState(SETTINGS_TABS[0]!.id);
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(useSettingsStore.getState());
  const [changes, setChanges] = useState<Partial<SettingsState>>({});

  const handleTabChange = useCallback(
    (newChanges: Partial<SettingsState>) => {
      setTimeout(() => {
        if (open) {
          setChanges((prev) => ({
            ...prev,
            ...newChanges,
          }));
        }
      }, 0);
    },
    [open],
  );

  const handleSave = useCallback(() => {
    if (Object.keys(changes).length > 0) {
      const newSettings: SettingsState = {
        ...settings,
        ...changes,
      };
      setSettings(newSettings);
      setChanges({});
      changeSettings(newSettings);
      saveSettings();
    }
    setOpen(false);
  }, [settings, changes]);

  const handleOpen = useCallback(() => {
    setSettings(useSettingsStore.getState());
  }, []);

  const handleClose = useCallback(() => {
    setChanges({});
  }, []);

  useEffect(() => {
    if (open) {
      handleOpen();
    } else {
      handleClose();
    }
  }, [open, handleOpen, handleClose]);

  const mergedSettings = useMemo<SettingsState>(() => {
    return {
      ...settings,
      ...changes,
    };
  }, [settings, changes]);

  if (isReplay) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip title="Settings">
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings />
          </Button>
        </DialogTrigger>
      </Tooltip>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[850px] h-[90vh] sm:h-auto">
        <DialogHeader>
          <DialogTitle>GreenCeltAI Settings</DialogTitle>
          <DialogDescription>
            Manage your GreenCeltAI settings here.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTabId}>
          <div className="flex flex-col sm:flex-row h-[60vh] sm:h-120 w-full overflow-auto border-y">
            <ul className="flex flex-row sm:flex-col w-full sm:w-50 shrink-0 border-b sm:border-b-0 sm:border-r p-1 overflow-x-auto sm:overflow-x-visible">
              <div className="size-full">
                {SETTINGS_TABS.map((tab) => (
                  <li
                    key={tab.id}
                    className={cn(
                      "hover:accent-foreground hover:bg-accent mr-1 sm:mr-0 sm:mb-1 flex h-8 min-w-[100px] sm:w-full cursor-pointer items-center gap-1.5 rounded px-2 whitespace-nowrap",
                      activeTabId === tab.id &&
                        "!bg-primary !text-primary-foreground",
                    )}
                    onClick={() => setActiveTabId(tab.id)}
                  >
                    {React.createElement(tab.icon, { size: 16 })}
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <Badge
                        variant="outline"
                        className={cn(
                          "border-muted-foreground text-muted-foreground ml-auto px-1 py-0 text-xs",
                          activeTabId === tab.id &&
                            "border-primary-foreground text-primary-foreground",
                        )}
                      >
                        {tab.badge}
                      </Badge>
                    )}
                  </li>
                ))}
              </div>
            </ul>
            <div className="min-w-0 flex-grow max-h-[40vh] sm:max-h-none">
              <div
                id="settings-content-scrollable"
                className="size-full overflow-auto p-2 sm:p-4"
              >
                {SETTINGS_TABS.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id}>
                    <tab.component
                      settings={mergedSettings}
                      onChange={handleTabChange}
                    />
                  </TabsContent>
                ))}
              </div>
            </div>
          </div>
        </Tabs>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button className="w-full sm:w-auto" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="w-full sm:w-24" type="submit" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
