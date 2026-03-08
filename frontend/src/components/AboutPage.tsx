import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { openExternal } from "@/lib/utils";
import { GetOSInfo } from "../../wailsjs/go/main/App";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Bug, Lightbulb, ExternalLink, CircleHelp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DragDropMedia } from "./DragDropTextarea";

interface AboutPageProps {
  version: string;
}

export function AboutPage({ version }: AboutPageProps) {
  const [os, setOs] = useState("Unknown");
  const [location, setLocation] = useState("Unknown");
  const [activeTab, setActiveTab] = useState<"bug_report" | "feature_request" | "faq">(
    "bug_report",
  );
  const [bugType, setBugType] = useState("Track");
  const [problem, setProblem] = useState("");
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [bugContext, setBugContext] = useState("");
  const [featureDesc, setFeatureDesc] = useState("");
  const [useCase, setUseCase] = useState("");
  const [featureContext, setFeatureContext] = useState("");

  useEffect(() => {
    const fetchOS = async () => {
      try {
        const info = await GetOSInfo();
        setOs(info);
      } catch (err) {
        const userAgent = window.navigator.userAgent;
        if (userAgent.indexOf("Win") !== -1) setOs("Windows");
        else if (userAgent.indexOf("Mac") !== -1) setOs("macOS");
        else if (userAgent.indexOf("Linux") !== -1) setOs("Linux");
      }
    };
    fetchOS();

    const fetchLocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        if (response.ok) {
          const data = await response.json();
          const city = data.city || "";
          const region = data.region || "";
          const country = data.country_name || "";
          const parts = [city, region, country].filter(Boolean);
          setLocation(parts.join(", ") || "Unknown");
        } else {
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          setLocation(timezone);
        }
      } catch (err) {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setLocation(timezone);
      }
    };
    fetchLocation();
  }, []);

  const faqs = [
    {
      q: "¿Este programa es gratuito?",
      a: "Sí. Este software es completamente gratuito. No necesitas cuenta, inicio de sesión ni suscripción; solo conexión a internet.",
    },
    {
      q: "¿Pueden suspender o banear mi cuenta de Spotify por usarlo?",
      a: "No. Este software no se conecta a tu cuenta de Spotify. Los datos se obtienen del reproductor web de Spotify mediante ingeniería inversa, sin autenticación de usuario.",
    },
    {
      q: "¿De dónde viene el audio?",
      a: "El audio se obtiene utilizando APIs de terceros.",
    },
    {
      q: "¿Por qué a veces falla la obtención de metadatos?",
      a: "Normalmente es porque tu IP ha sido limitada por uso. Puedes esperar y volver a intentarlo más tarde, o usar una VPN para evitar el límite.",
    },
    {
      q: "¿Por qué Windows Defender o el antivirus lo marca o elimina?",
      a: "Es un falso positivo. Suele ocurrir porque el ejecutable está comprimido con UPX. Si te preocupa, puedes hacer un fork del repositorio y compilarlo tú mismo desde el código fuente.",
    },
  ];

  const handleSubmit = () => {
    const title =
      activeTab === "bug_report"
        ? `[Bug Report] ${problem.substring(0, 50)}${
            problem.length > 50 ? "..." : ""
          }`
        : `[Feature Request] ${featureDesc.substring(0, 50)}${
            featureDesc.length > 50 ? "..." : ""
          }`;

    let bodyContent = "";

    if (activeTab === "bug_report") {
      const contextContent = bugContext.trim()
        ? bugContext.trim()
        : "Escribe aquí o adjunta captura/grabación";

      bodyContent = `### [Bug Report]

#### Problema
${problem || "Escribe aquí"}

#### Tipo
${bugType}

#### URL de Spotify
${spotifyUrl || "Escribe aquí"}

#### Contexto adicional
${contextContent}

#### Entorno
- Versión SpotiFLAC: ${version}
- SO: ${os}
- Ubicación: ${location}`;
    } else {
      const contextContent = featureContext.trim()
        ? featureContext.trim()
        : "Escribe aquí o adjunta captura/grabación";

      bodyContent = `### [Feature Request]

#### Descripción
${featureDesc || "Escribe aquí"}

#### Caso de uso
${useCase || "Escribe aquí"}

#### Contexto adicional
${contextContent}`;
    }

    const params = new URLSearchParams({
      title: title,
      body: bodyContent,
    });
    const url = `https://github.com/afkarxyz/SpotiFLAC/issues/new?${params.toString()}`;
    openExternal(url);
  };

  return (
    <div
      className={`flex flex-col space-y-4 ${
        activeTab === "faq" ? "h-[calc(100vh-10rem)]" : ""
      }`}
    >
      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-2xl font-bold tracking-tight">Acerca de</h2>
      </div>

      <div className="flex gap-2 border-b shrink-0">
        <Button
          variant={activeTab === "bug_report" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("bug_report")}
          className="rounded-b-none"
        >
          <Bug className="h-4 w-4" />
          Reportar error
        </Button>
        <Button
          variant={activeTab === "feature_request" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("feature_request")}
          className="rounded-b-none"
        >
          <Lightbulb className="h-4 w-4" />
          Sugerir función
        </Button>
        <Button
          variant={activeTab === "faq" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("faq")}
          className="rounded-b-none"
        >
          <CircleHelp className="h-4 w-4" />
          FAQ
        </Button>
      </div>

      <div
        className={`flex-1 min-h-0 ${
          activeTab === "faq" ? "overflow-hidden" : ""
        }`}
      >
        {activeTab === "bug_report" && (
          <div className="flex flex-col">
            <div className="space-y-4 pt-4 flex flex-col">
              <div className="mt-4 pr-2">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2 flex flex-col">
                    <Label>Problema</Label>
                    <Textarea
                      className="h-56 resize-none"
                      placeholder="Describe el problema..."
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <Label>Contexto adicional</Label>
                    <DragDropMedia
                      className="min-h-[14rem]"
                      value={bugContext}
                      onChange={setBugContext}
                    />
                  </div>
                  <div className="space-y-4 flex flex-col">
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <ToggleGroup
                        type="single"
                        value={bugType}
                        onValueChange={(val) => {
                          if (val) setBugType(val);
                        }}
                        className="justify-start w-full cursor-pointer"
                      >
                        <ToggleGroupItem
                          value="Track"
                          className="flex-1 cursor-pointer"
                          aria-label="Toggle track"
                        >
                          Canción
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="Album"
                          className="flex-1 cursor-pointer"
                          aria-label="Toggle album"
                        >
                          Álbum
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="Playlist"
                          className="flex-1 cursor-pointer"
                          aria-label="Toggle playlist"
                        >
                          Playlist
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="Artist"
                          className="flex-1 cursor-pointer"
                          aria-label="Toggle artist"
                        >
                          Artista
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                    <div className="space-y-2">
                      <Label>URL de Spotify</Label>
                      <Input
                        placeholder="https://open.spotify.com/..."
                        value={spotifyUrl}
                        onChange={(e) => setSpotifyUrl(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center pt-4 shrink-0">
              <Button
                className="w-[200px] cursor-pointer gap-2"
                onClick={handleSubmit}
              >
                <ExternalLink className="h-4 w-4" /> Crear issue en GitHub
              </Button>
            </div>
          </div>
        )}

        {activeTab === "feature_request" && (
          <div className="flex flex-col">
            <div className="space-y-4 pt-4 flex flex-col">
              <div className="mt-4 pr-2">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2 flex flex-col">
                    <Label>Descripción</Label>
                    <Textarea
                      className="h-56 resize-none"
                      placeholder="Describe la función que te gustaría..."
                      value={featureDesc}
                      onChange={(e) => setFeatureDesc(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 flex-col">
                    <Label>Caso de uso</Label>
                    <Textarea
                      className="h-56 resize-none"
                      placeholder="¿Cómo te sería útil esta función?"
                      value={useCase}
                      onChange={(e) => setUseCase(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 flex-col">
                    <Label>Contexto adicional</Label>
                    <DragDropMedia
                      className="min-h-[14rem]"
                      value={featureContext}
                      onChange={setFeatureContext}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center pt-4 shrink-0">
              <Button
                className="w-[200px] cursor-pointer gap-2"
                onClick={handleSubmit}
              >
                <ExternalLink className="h-4 w-4" /> Crear issue en GitHub
              </Button>
            </div>
          </div>
        )}

        {activeTab === "faq" && (
          <ScrollArea className="h-full">
            <div className="p-1 pr-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preguntas frecuentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {faqs.map((faq, index) => (
                    <div key={index} className="space-y-2">
                      <h3 className="font-medium text-base text-foreground/90">
                        {faq.q}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
