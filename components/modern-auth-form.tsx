"use client";

import {
  Alert,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  Box,
  InputAdornment,
  IconButton,
  Divider,
  Link,
} from "@mui/material";
import { useState } from "react";
import { login, registerWithRole, saveToken, type UserRole } from "@/lib/api";
import NextLink from "next/link";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

type AuthMode = "login" | "register";

interface ModernAuthFormProps {
  mode: AuthMode;
  onAuthenticated: () => Promise<void>;
}

export function ModernAuthForm({ mode, onAuthenticated }: ModernAuthFormProps) {
  const isRegister = mode === "register";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("MEMBER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleSubmit() {
    // Validation
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const auth = isRegister
        ? await registerWithRole({ email: email.toLowerCase(), password, role })
        : await login({ email: email.toLowerCase(), password });
      saveToken(auth.token);
      await onAuthenticated();
    } catch {
      setError(isRegister ? "Registration failed. Email may already be in use." : "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit();
    }
  };

  return (
    <Stack spacing={3}>
      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{
            borderRadius: 2,
            animation: "slideDown 0.3s ease-out",
            "@keyframes slideDown": {
              "0%": { opacity: 0, transform: "translateY(-10px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
          }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Form Fields */}
      <Stack spacing={2.5}>
        {/* Email Field */}
        <TextField
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="you@example.com"
          disabled={loading}
          fullWidth
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailRoundedIcon sx={{ color: "text.secondary", mr: 1 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              transition: "all 0.2s",
              "&:hover": {
                "& fieldset": {
                  borderColor: "primary.main",
                },
              },
              "&.Mui-focused": {
                boxShadow: "0 0 0 3px rgba(21, 94, 239, 0.1)",
              },
            },
          }}
        />

        {/* Password Field */}
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="••••••••"
          disabled={loading}
          fullWidth
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockRoundedIcon sx={{ color: "text.secondary", mr: 1 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  disabled={loading}
                  size="small"
                >
                  {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              transition: "all 0.2s",
              "&:hover": {
                "& fieldset": {
                  borderColor: "primary.main",
                },
              },
              "&.Mui-focused": {
                boxShadow: "0 0 0 3px rgba(21, 94, 239, 0.1)",
              },
            },
          }}
        />

        {/* Confirm Password Field (Register only) */}
        {isRegister && (
          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="••••••••"
            disabled={loading}
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockRoundedIcon sx={{ color: "text.secondary", mr: 1 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    disabled={loading}
                    size="small"
                  >
                    {showConfirmPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                transition: "all 0.2s",
                "&:hover": {
                  "& fieldset": {
                    borderColor: "primary.main",
                  },
                },
                "&.Mui-focused": {
                  boxShadow: "0 0 0 3px rgba(21, 94, 239, 0.1)",
                },
              },
            }}
          />
        )}

        {/* Role Selection (Register only) */}
        {isRegister && (
          <TextField
            label="Account Type"
            select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            disabled={loading}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonRoundedIcon sx={{ color: "text.secondary", mr: 1 }} />
                </InputAdornment>
              ),
            }}
            helperText="Choose Member for standard access or Admin for management."
            sx={{
              "& .MuiOutlinedInput-root": {
                transition: "all 0.2s",
                "&:hover": {
                  "& fieldset": {
                    borderColor: "primary.main",
                  },
                },
                "&.Mui-focused": {
                  boxShadow: "0 0 0 3px rgba(21, 94, 239, 0.1)",
                },
              },
            }}
          >
            <MenuItem value="MEMBER">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                👤 Member - Standard Access
              </Box>
            </MenuItem>
            <MenuItem value="ADMIN">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                🔐 Admin - Full Management
              </Box>
            </MenuItem>
          </TextField>
        )}
      </Stack>

      {/* Submit Button */}
      <Button
        variant="contained"
        size="large"
        onClick={handleSubmit}
        disabled={loading}
        fullWidth
        sx={{
          py: 1.5,
          fontWeight: 700,
          fontSize: "1rem",
          textTransform: "none",
          borderRadius: 2.5,
          background: "linear-gradient(135deg, #155eef 0%, #0ea5a4 100%)",
          boxShadow: "0 8px 24px rgba(21, 94, 239, 0.3)",
          transition: "all 0.3s",
          "&:hover:not(:disabled)": {
            transform: "translateY(-2px)",
            boxShadow: "0 12px 32px rgba(21, 94, 239, 0.4)",
          },
          "&:active:not(:disabled)": {
            transform: "translateY(0)",
          },
          "&:disabled": {
            opacity: 0.7,
          },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <Stack direction="row" alignItems="center" gap={1}>
            <CircularProgress size={20} sx={{ color: "inherit" }} />
            <span>{isRegister ? "Creating account..." : "Signing in..."}</span>
          </Stack>
        ) : isRegister ? (
          "Create Account"
        ) : (
          "Sign In"
        )}
      </Button>

      {/* Divider */}
      <Divider sx={{ my: 1 }}>
        <Typography variant="body2" color="text.secondary">
          or
        </Typography>
      </Divider>

      {/* Footer Link */}
      <Box textAlign="center">
        <Typography variant="body2" color="text.secondary">
          {isRegister ? "Already have an account?" : "New here?"}{" "}
          <Link
            component={NextLink}
            href={isRegister ? "/login" : "/register"}
            sx={{
              fontWeight: 600,
              color: "primary.main",
              textDecoration: "none",
              transition: "all 0.2s",
              "&:hover": {
                textDecoration: "underline",
                opacity: 0.8,
              },
            }}
          >
            {isRegister ? "Sign in" : "Create an account"}
          </Link>
        </Typography>
      </Box>
    </Stack>
  );
}
