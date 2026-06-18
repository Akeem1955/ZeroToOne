import subprocess
import time
import sys

def main():
    # Run python with '-u' for unbuffered output to stream logs instantly
    cmd = [sys.executable, "-u", "agent.py", "start"]
    print("Starting LiveKit Agent resilient wrapper...", flush=True)
    
    while True:
        try:
            print(f"Launching agent worker: {' '.join(cmd)}", flush=True)
            # Run the process and pipe stderr/stdout to stream them in real-time
            process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1
            )
            
            # Stream the stdout line by line
            if process.stdout:
                for line in process.stdout:
                    print(line, end='', flush=True)
            
            process.wait()
            print(f"Agent worker exited with code {process.returncode}. Restarting in 2 seconds...", flush=True)
        except KeyboardInterrupt:
            print("Terminating agent wrapper...", flush=True)
            break
        except Exception as e:
            print(f"Error running agent: {e}", flush=True)
        time.sleep(2)

if __name__ == "__main__":
    main()
