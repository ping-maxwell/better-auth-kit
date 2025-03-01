"use client";
import { motion } from "framer-motion";
import { faker } from "@faker-js/faker";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

export const AdminDashboardOffer = ({
  isHovering,
}: {
  isHovering: boolean;
}) => {
  //   const clear = useCallback(() => {}, []);

  //   const restartAnimation = useCallback(() => {
  //     clear();
  //   }, [clear]);

  //   useEffect(() => {
  //     if (isHovering) {
  //       restartAnimation();
  //     }

  //     return () => {
  //       clear();
  //     };
  //   }, [isHovering, clear, restartAnimation]);

  return (
    <motion.div
      className={cn(
        "w-full h-full p-5 select-none transition-opacity duration-150 ease-in-out relative overflow-hidden flex justify-center items-center",
        !isHovering && "opacity-90"
      )}
      animate={
        isHovering
          ? {
              scale: 1.1,
            }
          : { scale: 1 }
      }
    >
      <div className="w-full h-full bg-gradient-to-br from-fd-border/50 to-fd-border/40 rounded-lg relative flex">
        <Sidebar />
        <div className="w-full h-full relative p-2 flex gap-3 justify-center items-center flex-wrap">
          <Graph1 isHover={isHovering} />
          <Graph1 isHover={isHovering} />
          <Logs />
        </div>
      </div>
    </motion.div>
  );
};

function Sidebar() {
  return <div className="w-[30%] h-full bg-fd-border/30 rounded-l-lg flex flex-col p-1 gap-1" style={{
    fontSize: "6.5px"
  }}>
    <div className="w-full rounded-sm py-[1px] bg-fd-border text-center text-fd-muted-foreground">Home</div>
    <div className="w-full rounded-sm py-[1px] bg-fd-border/50 text-center text-fd-muted-foreground/50">Users</div>
    <div className="w-full rounded-sm py-[1px] bg-fd-border/50 text-center text-fd-muted-foreground/50">Orgs</div>
    <div className="w-full rounded-sm py-[1px] bg-fd-border/50 text-center text-fd-muted-foreground/50">API Keys</div>
  </div>;
}

function Graph1({ isHover }: { isHover: boolean }) {
  const [data, setData] = useState(generateRandomData(5, 200, 100));
  const generatePath = useCallback((dataPoints: { x: number; y: number }[]) => {
    if (!dataPoints || dataPoints.length < 2) {
      return "";
    }

    let path = `M ${dataPoints[0].x} ${dataPoints[0].y}`;

    for (let i = 1; i < dataPoints.length; i++) {
      path += ` L ${dataPoints[i].x} ${dataPoints[i].y}`;
    }

    return path;
  }, []);
  const [svgPath, setsvgPath] = useState<string>(generatePath(data)); // Ref to store the SVG path
  const maxX = Math.max(...data.map((point) => point.x));
  const maxY = Math.max(...data.map((point) => point.y));

  const pathVariants = {
    hidden: {
      opacity: 0,
      pathLength: 0,
    },
    visible: {
      opacity: 1,
      pathLength: 1,
      transition: {
        duration: 1, // Reduced duration for smoother transition
        ease: "easeInOut",
      },
    },
  };

  useEffect(() => {
    if (isHover) {
      const newData = generateRandomData(10, 200, 100);
      setData(newData);
      setsvgPath(generatePath(newData));
    }
  }, [isHover, generatePath]);

  return (
    <div className="w-[60px] h-[40px] rounded-sm bg-fd-card">
      <svg
        width="60"
        height="40"
        viewBox={`0 0 ${maxX} ${maxY}`} // Dynamic viewBox
        suppressHydrationWarning
      >
        <motion.path
          suppressHydrationWarning
          d={svgPath} // Use the ref here
          stroke="steelblue"
          strokeWidth="1" // Adjust stroke width for smaller size
          fill="none"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
          key={svgPath} // Force re-render on path change
        />
      </svg>
    </div>
  );
}

function Logs() {
  const [user1, setUser1] = useState({
    avatar: faker.image.avatar(),
    name: faker.name.fullName(),
    email: faker.internet.email(),
  });
  const [user2, setUser2] = useState({
    avatar: faker.image.avatar(),
    name: faker.name.fullName(),
    email: faker.internet.email(),
  });
  const [user3, setUser3] = useState({
    avatar: faker.image.avatar(),
    name: faker.name.fullName(),
    email: faker.internet.email(),
  });
  return (
    <div className="w-full h-[80px] -mt-2 overflow-hidden">
      <div className="w-full h-full flex flex-col gap-2 overflow-y-auto">
        <UserLog avatar={user1.avatar} name={user1.name} email={user1.email} />
        <UserLog avatar={user2.avatar} name={user2.name} email={user2.email} />
        <UserLog avatar={user3.avatar} name={user3.name} email={user3.email} />
      </div>
    </div>
  );
}

function UserLog(user: { avatar: string; name: string; email: string }) {
  return (
    <motion.div
      className="flex w-full h-fit gap-2 overflow-hidden p-1 items-center border border-fd-border rounded-sm"
      style={{
        fontSize: "6px",
      }}
      suppressHydrationWarning
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 2,
      }}
    >
      <img
        src={user.avatar}
        alt="User Avatar"
        width={10}
        height={10}
        className="size-[14px] rounded-full"
        suppressHydrationWarning
      />
      <div className="flex flex-col">
        <p className="text-fd-muted-foreground" suppressHydrationWarning>
          {user.name.split(" ")[0]}
        </p>
        <p
          suppressHydrationWarning
          className="text-fd-muted-foreground/50"
          style={{
            fontSize: "5px",
          }}
        >
          {user.email}
        </p>
      </div>
    </motion.div>
  );
}

const generateRandomData = (
  numPoints: number,
  maxX: number,
  maxY: number
): { x: number; y: number }[] => {
  const data: { x: number; y: number }[] = [];

  // Ensure the first point starts at x = 0
  data.push({ x: 0, y: Math.floor(Math.random() * maxY) });

  // Generate the remaining points with more y variation
  for (let i = 1; i < numPoints - 1; i++) {
    // Introduce more variation in y-values
    const yVariation = Math.random() * 2 - 1; // Range: -1 to 1
    let y = Math.floor(Math.random() * maxY);

    // Adjust y to create more spikes, but keep it within bounds
    y = Math.max(0, Math.min(maxY, y + Math.floor((yVariation * maxY) / 2)));

    data.push({
      x: Math.floor(Math.random() * (maxX - 1)) + 1, // Ensure x > 0
      y: y,
    });
  }

  // Ensure the last point ends at x = maxX
  data.push({ x: maxX, y: Math.floor(Math.random() * maxY) });

  // Sort the data by x-value to ensure a proper line graph
  data.sort((a, b) => a.x - b.x);
  return data;
};
