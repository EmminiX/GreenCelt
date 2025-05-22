# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# Modifications and enhancements by Emmi C (GreenCeltAI)
# SPDX-License-Identifier: MIT

import logging

from src.podcast.graph.state import PodcastState

logger = logging.getLogger(__name__)


def audio_mixer_node(state: PodcastState):
    logger.info("Audio functionality has been removed...")
    # Return a placeholder message instead of audio
    placeholder_message = b"TTS functionality has been removed from this application."
    logger.info("Returning placeholder message instead of audio.")
    return {"output": placeholder_message}
