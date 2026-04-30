

import express from "express";
import bootstrap from "./app.controller.js";
import { devConfig } from "./config/env/dev.config.js";
import { exec } from "child_process";
import cors from "cors";

const app = express();

// ✅ CORS (لازم يتحط قبل الروترات)
app.use(cors());

// لو عايزة تتحكمي فيه:
app.use(cors({
  origin: "*", // أو حطي URL الفرونت بعد كده
  credentials: true
}));

bootstrap(app, express);

const PORT = devConfig.PORT || 3000;

function freePortAndStart(port) {
    exec(`netstat -ano | findstr :${port}`, (err, stdout) => {
        if (stdout) {
            const pid = parseInt(stdout.trim().split(/\s+/).pop());
            if (pid > 0) {
                console.log(`Port ${port} is in use by PID ${pid}. Killing process...`);
                exec(`taskkill /PID ${pid} /F`, () => {
                    startServer(port);
                });
            } else {
                startServer(port);
            }
        } else {
            startServer(port);
        }
    });
}

function startServer(port) {
    app.listen(port, () => {
        console.log(`🔥 Server is running on port ${port}`);
        console.log(`🌐 Local URL: http://localhost:${port}`);
    });
}

freePortAndStart(PORT);