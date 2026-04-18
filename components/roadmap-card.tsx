"use client";

import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";

const roadmapItems = [
  {
    title: "Record & replay test generation",
    detail: "Capture user interactions and turn them into reusable test flows.",
  },
  {
    title: "AI-based test prioritization",
    detail: "Rank critical tests first using historical failures and change risk.",
  },
  {
    title: "Cross-browser testing grid",
    detail: "Run the same suite across multiple browsers and device profiles.",
  },
  {
    title: "Slack / Email alerts",
    detail: "Send run notifications to the team when tests pass or fail.",
  },
  {
    title: "Test flakiness detection",
    detail: "Detect unstable tests and surface the ones that need attention.",
  },
];

export function RoadmapCard() {
  return (
    <Paper className="glass-panel" sx={{ p: 2.5, borderRadius: 4 }}>
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Future Enhancements
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The next product steps after the current Phase 4 foundation.
          </Typography>
        </Box>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} flexWrap="wrap" useFlexGap>
          <Chip icon={<RocketLaunchRoundedIcon />} label="Product roadmap" variant="outlined" />
          <Chip icon={<FlagRoundedIcon />} label="Phase 4 follow-up" variant="outlined" />
          <Chip icon={<SecurityRoundedIcon />} label="SaaS scaling" variant="outlined" />
        </Stack>
        <Stack spacing={1.1}>
          {roadmapItems.map((item) => (
            <Box key={item.title} sx={{ p: 1.3, borderRadius: 2, bgcolor: "action.hover" }}>
              <Typography variant="body1" fontWeight={700}>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.4}>
                {item.detail}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}
