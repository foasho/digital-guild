"use client";

import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="worker-bg flex min-h-screen items-center justify-center font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-8 py-32 px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-col items-center gap-3 pb-0 pt-6">
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={100}
              height={20}
              priority
            />
            <h1 className="text-2xl font-bold text-worker-text-primary">
              Digital Guild
            </h1>
            <p className="text-worker-text-secondary text-sm">
              HeroUI + Tailwind CSS 4 Setup Complete
            </p>
          </CardHeader>
          <CardBody className="flex flex-col items-center gap-4 px-6 py-6">
            <p className="text-center text-worker-text-secondary">
              Worker Theme is now active. The background changes based on time
              of day.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button color="primary" variant="solid">
                Primary
              </Button>
              <Button color="secondary" variant="solid">
                Secondary
              </Button>
              <Button color="success" variant="solid">
                Success
              </Button>
              <Button color="warning" variant="solid">
                Warning
              </Button>
              <Button color="danger" variant="solid">
                Danger
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button color="primary" variant="bordered">
                Bordered
              </Button>
              <Button color="primary" variant="flat">
                Flat
              </Button>
              <Button color="primary" variant="ghost">
                Ghost
              </Button>
              <Button color="primary" variant="light">
                Light
              </Button>
            </div>
          </CardBody>
        </Card>

        <div className="worker-card p-6 text-center">
          <h2 className="text-lg font-semibold text-worker-text-primary mb-2">
            Worker Card Component
          </h2>
          <p className="text-worker-text-secondary text-sm">
            This card uses the custom worker-card class with glass morphism
            effect.
          </p>
        </div>
      </main>
    </div>
  );
}
