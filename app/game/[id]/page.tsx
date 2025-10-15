"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { Header } from "@/components/header";
import { PixelBackground } from "@/components/pixel-background";
import { OnlineGameBoard } from "@/components/online-game-board";
import { GameStatus } from "@/components/game-status";
import { GameControls } from "@/components/game-controls";
import { WinnerAnimation } from "@/components/winner-animation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGameStore } from "@/stores/game-store";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Loader2, Copy, Check } from "lucide-react";

export default function OnlineGamePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const roomId = params.id;
  const { toast } = useToast();


  const [loading, setLoading] = useState(true);
  const [roomExists, setRoomExists] = useState(false);
  const [needsCode, setNeedsCode] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [validating, setValidating] = useState(false);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [joined, setJoined] = useState(false);

  const codeParam = searchParams.get("code");


  const { setRoomData, setGameMode, setGameStatus } = useGameStore();

  useEffect(() => {
    if (joined && roomExists) return;
    if (!roomId || !codeParam) {
      return;
    }

    const checkRoom = async () => {
      try {
        const response = await fetch(`/api/rooms/${roomId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          toast({
            title: t("errors.notFound"),
            variant: "destructive",
          });
          router.replace("/");
          return;
        }

        const data = await response.json();
        setRoomExists(true);
        setRoomCode(data.code);

        if (codeParam) {
          await validateCode(codeParam);
        } else {
          setNeedsCode(true);
          setLoading(false);
        }
      } catch (error) {
        console.error("[v0] Error checking room:", error);
        toast({
          title: t("errors.connectionError"),
          variant: "destructive",
        });
        router.replace("/");
      }
    };

    checkRoom();
  }, [roomId, codeParam, joined, roomExists]);

  const validateCode = async (code: string) => {
    setValidating(true);
    try {
      const response = await fetch(`/api/rooms/${roomId}/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        toast({
          title: t("errors.invalidCode"),
          variant: "destructive",
        });
        setValidating(false);
        return;
      }

      setGameMode("online");
      setRoomData(String(roomId), code);
      setGameStatus("playing");
      setNeedsCode(false);
      setJoined(true);
      setLoading(false);
    } catch (error) {
      console.error("[v0] Error validating code:", error);
      toast({
        title: t("errors.connectionError"),
        variant: "destructive",
      });
      setValidating(false);
    }
  };

  const handleJoinRoom = () => {
    if (codeInput.trim()) {
      validateCode(codeInput.trim().toUpperCase());
    }
  };

  const copyToClipboard = (text: string, type: "link" | "code") => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: t("game.copied"),
    });
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col">
        <PixelBackground />
        <Header />
        <div className="flex-1 flex items-center justify-center p-4 pt-24">
          <Card className="w-full max-w-md pixel-shadow border-4 border-foreground/20 bg-card/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold font-mono">
                {validating ? "Validating..." : "Loading..."}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (needsCode) {
    const shareLink =
      typeof window !== "undefined"
        ? `${window.location.origin}/game/${roomId}?code=${roomCode}`
        : "";

    return (
      <main className="min-h-screen flex flex-col">
        <PixelBackground />
        <Header />
        <div className="flex-1 flex items-center justify-center p-4 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <Card className="pixel-shadow border-4 border-foreground/20 bg-card/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-center text-2xl font-bold font-mono">
                  {t("home.joinGame")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Share section */}
                <div className="space-y-3 pb-4 border-b-2 border-border">
                  <Label className="text-base font-semibold">
                    {t("game.shareLink")}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={shareLink}
                      readOnly
                      className="flex-1 font-mono text-sm pixel-border"
                    />
                    <Button
                      onClick={() => copyToClipboard(shareLink, "link")}
                      size="icon"
                      className="pixel-shadow"
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <Label className="text-base font-semibold">
                    {t("game.roomCode")}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={roomCode || ""}
                      readOnly
                      className="flex-1 font-mono text-2xl text-center font-bold pixel-border"
                    />
                    <Button
                      onClick={() => copyToClipboard(roomCode || "", "code")}
                      size="icon"
                      className="pixel-shadow"
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Join section */}
                <div className="space-y-3">
                  <Label
                    htmlFor="code-input"
                    className="text-base font-semibold"
                  >
                    {t("home.enterCode")}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="code-input"
                      placeholder="ABC123"
                      value={codeInput}
                      onChange={(e) =>
                        setCodeInput(e.target.value.toUpperCase())
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleJoinRoom();
                        }
                      }}
                      className="flex-1 h-12 text-center font-mono text-lg uppercase pixel-border"
                      maxLength={6}
                      disabled={validating}
                    />
                    <Button
                      onClick={handleJoinRoom}
                      disabled={!codeInput.trim() || validating}
                      className="h-12 px-6 font-bold pixel-shadow hover:pixel-pressed transition-all"
                      size="lg"
                    >
                      {validating ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        t("home.join")
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <PixelBackground />
      <Header />
      <WinnerAnimation />

      <div className="flex-1 flex items-center justify-center p-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <Card className="pixel-shadow border-4 border-foreground/20 bg-card/95 backdrop-blur p-4 md:p-6">
            <GameStatus />
            <OnlineGameBoard roomId={String(roomId ?? "")} />
            <div className="mt-6">
              <GameControls />
            </div>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
