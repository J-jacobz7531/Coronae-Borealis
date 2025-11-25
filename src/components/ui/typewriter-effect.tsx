"use client";

import { cn } from "@/lib/utils";
import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { useEffect, useState } from "react";

export const TypewriterEffectSmooth = ({
    words,
    className,
    cursorClassName,
}: {
    words: {
        text: string;
        className?: string;
    }[];
    className?: string;
    cursorClassName?: string;
}) => {
    // Build a flat list of characters so we can type/delete them one by one,
    // while still respecting per-word className and spaces.
    const chars = words.flatMap((word, wIdx) => {
        const letters = word.text.split("").map((char, cIdx) => ({
            char,
            className: word.className,
            key: `w${wIdx}-c${cIdx}`,
        }));
        // Add a space after each word (except maybe the last)
        return [
            ...letters,
            {
                char: " ",
                className: word.className,
                key: `w${wIdx}-space`,
            },
        ];
    });

    const totalChars = chars.length;

    const [visibleCount, setVisibleCount] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (totalChars === 0) return;

        const typingSpeed = 80;          // ms per character when typing
        const deletingSpeed = 40;        // ms per character when deleting
        const pauseBeforeDelete = 10000; // 10 seconds after fully typed
        const pauseBeforeRetype = 500;   // small pause before starting to type again

        let timeout: ReturnType<typeof setTimeout>;

        if (!isDeleting) {
            // Typing phase
            if (visibleCount < totalChars) {
                timeout = setTimeout(() => {
                    setVisibleCount((v) => v + 1);
                }, typingSpeed);
            } else {
                // Fully typed, wait 10 seconds, then start deleting
                timeout = setTimeout(() => {
                    setIsDeleting(true);
                }, pauseBeforeDelete);
            }
        } else {
            // Deleting phase
            if (visibleCount > 0) {
                timeout = setTimeout(() => {
                    setVisibleCount((v) => v - 1);
                }, deletingSpeed);
            } else {
                // Fully deleted, short pause, then start typing again
                timeout = setTimeout(() => {
                    setIsDeleting(false);
                }, pauseBeforeRetype);
            }
        }

        return () => clearTimeout(timeout);
    }, [visibleCount, isDeleting, totalChars]);

    return (
        <div className={cn("flex space-x-1 my-6", className)}>
            <div
                className="overflow-hidden pb-2"
                style={{ whiteSpace: "nowrap" }}
            >
                <div className="text-xs sm:text-base md:text-xl lg:text:3xl xl:text-5xl font-bold">
                    {chars.slice(0, visibleCount).map(({ char, className, key }) => (
                        <span
                            key={key}
                            className={cn("dark:text-white text-black", className)}
                        >
                            {char}
                        </span>
                    ))}
                </div>
            </div>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
                className={cn(
                    "block rounded-sm w-[4px] h-4 sm:h-6 xl:h-12 bg-blue-500",
                    cursorClassName
                )}
            />
        </div>
    );
};

export const TypewriterEffect = ({
    words,
    className,
    cursorClassName,
}: {
    words: {
        text: string;
        className?: string;
    }[];
    className?: string;
    cursorClassName?: string;
}) => {
    // Split text inside of words into array of characters
    const wordsArray = words.map((word) => {
        return {
            ...word,
            text: word.text.split(""),
        };
    });
    const [scope, animate] = useAnimate();
    const isInView = useInView(scope);
    useEffect(() => {
        if (isInView) {
            animate(
                "span",
                {
                    display: "inline-block",
                    opacity: 1,
                },
                {
                    duration: 0.3,
                    delay: stagger(0.1),
                    ease: "easeInOut",
                }
            );
        }
    }, [isInView, animate]);

    const renderWords = () => {
        return (
            <motion.div ref={scope}>
                {wordsArray.map((word, idx) => {
                    return (
                        <div key={`word-${idx}`} className="inline-block">
                            {word.text.map((char, index) => (
                                <motion.span
                                    initial={{}}
                                    key={`char-${index}`}
                                    className={cn(
                                        `dark:text-white text-black opacity-0 hidden`,
                                        word.className
                                    )}
                                >
                                    {char}
                                </motion.span>
                            ))}
                            &nbsp;
                        </div>
                    );
                })}
            </motion.div>
        );
    };
    return (
        <div
            className={cn(
                "text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-center",
                className
            )}
        >
            {renderWords()}
            <motion.span
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 1,
                }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
                className={cn(
                    "inline-block rounded-sm w-[4px] h-4 md:h-6 lg:h-10 bg-blue-500",
                    cursorClassName
                )}
            ></motion.span>
        </div>
    );
};
