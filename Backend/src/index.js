import express from "express";
import bootstrap from "./app.controller.js";
import { devConfig } from "./config/env/dev.config.js";
import { exec } from "child_process";

const app = express();
bootstrap(app, express);

const PORT = devConfig.PORT || 3000;

function freePortAndStart(port) {
    exec(`netstat -ano | findstr :${port}`, (err, stdout) => {
        if (stdout) {
            const pid = parseInt(stdout.trim().split(/\s+/).pop());
            if (pid > 0) {
                console.log(`Port ${port} is in use by PID ${pid}. Killing process...`);
                exec(`taskkill /PID ${pid} /F`, (killErr) => {
                    if (killErr) {
                        console.error("Failed to kill process:", killErr.message);
                    } else {
                        console.log(`Process ${pid} killed.`);
                    }
                    // Start server regardless of kill success/failure
                    startServer(port);
                });
            } else {
                console.log(`No valid PID found for port ${port}, starting server...`);
                startServer(port);
            }
        } else {
            startServer(port);
        }
    });
}

function startServer(port) {
    app.listen(port, () => console.log(`Server is running on port ${port}`));
}


freePortAndStart(PORT);