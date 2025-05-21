import sys
import re
import statistics


if __name__ == "__main__":
    fileName = sys.argv[1]

    CPU0_UTILIZATION = []
    CPU1_UTILIZATION = []
    DISK_UTILIZATION = []

    with open(fileName, "r") as f:
        lines = f.readlines()
        while lines:
            line = lines.pop(0)
            if "Cpu" in line:
                cpu0Idle = re.split(r"\s+", lines.pop(0).strip())[-1]
                cpu1Idle = re.split(r"\s+", lines.pop(0).strip())[-1]
                CPU0_UTILIZATION.append(100 - float(cpu0Idle))
                CPU1_UTILIZATION.append(100 - float(cpu1Idle))
            if "sda" in line or "xvda" in line:
                diskUtilization = re.split(r"\s+", line.strip())[-1]
                DISK_UTILIZATION.append(float(diskUtilization))

print("CPU0 Utilization: ", statistics.mean(CPU0_UTILIZATION) / 100)
print("CPU1 Utilization: ", statistics.mean(CPU1_UTILIZATION) / 100)
print("Disk Utilization: ", statistics.mean(DISK_UTILIZATION) / 100)
