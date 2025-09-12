import { HybridPALAlgorithm } from "../model/hybrid_adaptive_learning";
import { useState } from "react";
import { useLearningAppFascade } from "../useSingleton/useLearningAppFascade";

function HybridLearner() {
  // --- Step 1: Define the initial state of the learner ---
  // This object holds all the information about the learner's progress.
  let initialGameState = {
    skillScore: 50,
    streak: 0,
    bestStreak: 0,
    lastDifficulty: "Easy",
    currentQuestionIndex: 0,
    showingQuestion: false,
    finished: false,
    selectedOption: null,
    currentQuestion: null,
    currentDifficulty: null,
    selectedLessonIndex: 0,

    // Enhanced personalization data
    learnerProfile: {
      responseTime: [], // Track how long user takes to answer
      difficultyHistory: [], // Track difficulty of last N questions
      accuracyByDifficulty: { Easy: [], Medium: [], Hard: [] }, // Track accuracy per difficulty
      consecutiveCorrect: 0,
      consecutiveWrong: 0,
      preferredDifficulty: null, // Learned preference
      adaptationRate: 0.5, // How quickly to adapt (0-1)
      confidenceLevel: 0.5, // Confidence in current skill assessment
      learningVelocity: 0, // Rate of improvement/decline
      sessionStartTime: Date.now(),
      questionStartTime: null,
    },
  };

  const [gameState, setGameState] = useState(initialGameState);
  const { questions } = useLearningAppFascade();

  // The algorithm is already initialized as window.PALHybridAlgorithm
  const learner = HybridPALAlgorithm.getInstance();
  learner.reset(); // Start with a fresh state
  const firstDifficulty = learner.getNextDifficulty({ state: gameState });
  console.log(firstDifficulty);

  function handleAnswer(correct) {
    setGameState((prev) => {
      const updated = updateScore(prev, correct, prev.currentDifficulty);
      return { ...updated };
    });
  }

  function updateScore(correct, difficulty) {
    const profile = gameState.learnerProfile;
    const responseTime = Date.now() - profile.questionStartTime;

    // Update basic score and streak
    const oldScore = gameState.skillScore;
    if (correct) {
      const increment = { Easy: 2, Medium: 5, Hard: 8 }[difficulty];
      gameState.skillScore += increment;
      gameState.streak += 1;
      gameState.bestStreak = Math.max(gameState.bestStreak, gameState.streak);
      profile.consecutiveCorrect += 1;
      profile.consecutiveWrong = 0;
    } else {
      const decrement = { Easy: 2, Medium: 4, Hard: 6 }[difficulty];
      gameState.skillScore -= decrement;
      gameState.streak = 0;
      profile.consecutiveWrong += 1;
      profile.consecutiveCorrect = 0;
    }

    gameState.skillScore = Math.max(0, Math.min(gameState.skillScore, 100));
    gameState.lastDifficulty = difficulty;

    // Update personalization data
    profile.responseTime.push(responseTime);
    if (profile.responseTime.length > 10) {
      profile.responseTime.shift(); // Keep only last 10 response times
    }

    // Track difficulty history
    profile.difficultyHistory.push({
      difficulty: difficulty,
      correct: correct,
      responseTime: responseTime,
      scoreChange: gameState.skillScore - oldScore,
      questionText: gameState.currentQuestion
        ? gameState.currentQuestion.q
        : null,
      selectedOption: gameState.selectedOption,
      correctAnswer: gameState.currentQuestion
        ? gameState.currentQuestion.answer
        : null,
    });
    if (profile.difficultyHistory.length > 15) {
      profile.difficultyHistory.shift(); // Keep last 15 questions
    }

    // Track accuracy by difficulty
    profile.accuracyByDifficulty[difficulty].push(correct);
    if (profile.accuracyByDifficulty[difficulty].length > 8) {
      profile.accuracyByDifficulty[difficulty].shift(); // Keep last 8 per difficulty
    }

    // Update learning velocity (rate of score change)
    if (profile.difficultyHistory.length >= 5) {
      const recent5 = profile.difficultyHistory.slice(-5);
      const scoreChanges = recent5.map((q) => q.scoreChange);
      profile.learningVelocity = scoreChanges.reduce((a, b) => a + b, 0) / 5;
    }

    // Update confidence level based on recent performance stability
    updateConfidenceLevel(profile);

    // Adapt the adaptation rate based on performance patterns
    updateAdaptationRate(profile);

    // Log personalization insights
    console.log("Learner Profile Update:", {
      difficulty: difficulty,
      correct: correct,
      responseTime: responseTime,
      learningVelocity: profile.learningVelocity.toFixed(3),
      confidenceLevel: profile.confidenceLevel.toFixed(3),
      easyAccuracy: calculateAccuracy(
        profile.accuracyByDifficulty.Easy
      ).toFixed(2),
      mediumAccuracy: calculateAccuracy(
        profile.accuracyByDifficulty.Medium
      ).toFixed(2),
      hardAccuracy: calculateAccuracy(
        profile.accuracyByDifficulty.Hard
      ).toFixed(2),
    });

    // Notify enhanced modules for additional updates
    // Priority: Hybrid RL > Pure RL > Enhanced Statistical
    if (
      window.PALHybridAlgorithm &&
      typeof window.PALHybridAlgorithm.updateProfileAfterAnswer === "function"
    ) {
      try {
        window.PALHybridAlgorithm.updateProfileAfterAnswer(
          gameState,
          correct,
          difficulty,
          responseTime
        );
      } catch (e) {
        console.warn("PALHybridAlgorithm.updateProfileAfterAnswer failed:", e);
      }
    } else if (
      window.PALRLAlgorithm &&
      typeof window.PALRLAlgorithm.updateProfileAfterAnswer === "function"
    ) {
      try {
        window.PALRLAlgorithm.updateProfileAfterAnswer(
          gameState,
          correct,
          difficulty,
          responseTime
        );
      } catch (e) {
        console.warn("PALRLAlgorithm.updateProfileAfterAnswer failed:", e);
      }
    } else if (
      window.PALAlgorithm &&
      typeof window.PALAlgorithm.updateProfileAfterAnswer === "function"
    ) {
      try {
        window.PALAlgorithm.updateProfileAfterAnswer(
          gameState,
          correct,
          difficulty,
          responseTime
        );
      } catch (e) {
        console.warn("PALAlgorithm.updateProfileAfterAnswer failed:", e);
      }
    }
  }

  function getQuestionDifficulty(score, streak, lastDiff) {
    const profile = gameState.learnerProfile;

    // Base probabilities based on skill score
    let probs = calculateBaseProbabilities(score);

    // Adjust based on recent performance
    probs = adjustForRecentPerformance(probs, profile);

    // Adjust based on response time patterns
    probs = adjustForResponseTime(probs, profile);

    // Adjust based on accuracy patterns
    probs = adjustForAccuracyPatterns(probs, profile);

    // Adjust based on streak and momentum
    probs = adjustForStreakMomentum(probs, streak, lastDiff);

    // Adjust for learning velocity (improvement/decline trend)
    probs = adjustForLearningVelocity(probs, profile);

    // Apply confidence-based fine-tuning
    probs = adjustForConfidence(probs, profile);

    // STABILITY SYSTEM: Prevent wild difficulty swings
    probs = applySmoothingBuffer(probs, profile);

    // Ensure probabilities sum to 1
    const total = probs.Easy + probs.Medium + probs.Hard;
    probs.Easy /= total;
    probs.Medium /= total;
    probs.Hard /= total;

    // Log the algorithm's reasoning
    console.log("🤖 Algorithm Decision Process:", {
      finalProbabilities: {
        Easy: (probs.Easy * 100).toFixed(1) + "%",
        Medium: (probs.Medium * 100).toFixed(1) + "%",
        Hard: (probs.Hard * 100).toFixed(1) + "%",
      },
      recentAccuracy:
        profile.difficultyHistory.length > 0
          ? `${(
              (profile.difficultyHistory
                .slice(-3)
                .reduce((sum, item) => sum + (item.correct ? 1 : 0), 0) /
                Math.min(3, profile.difficultyHistory.length)) *
              100
            ).toFixed(0)}%`
          : "N/A",
      confidence: `${(profile.confidenceLevel * 100).toFixed(0)}%`,
      learningVelocity: profile.learningVelocity.toFixed(2),
    });

    // Weighted random selection
    // Priority: Hybrid RL > Pure RL > Enhanced Statistical > Fallback Statistical
    if (
      window.PALHybridAlgorithm &&
      typeof window.PALHybridAlgorithm.getNextDifficulty === "function"
    ) {
      try {
        return window.PALHybridAlgorithm.getNextDifficulty({
          state: gameState,
        });
      } catch (e) {
        console.warn(
          "PALHybridAlgorithm.getNextDifficulty failed, falling back:",
          e
        );
      }
    }
    if (
      window.PALRLAlgorithm &&
      typeof window.PALRLAlgorithm.getNextDifficulty === "function"
    ) {
      try {
        return window.PALRLAlgorithm.getNextDifficulty({ state: gameState });
      } catch (e) {
        console.warn(
          "PALRLAlgorithm.getNextDifficulty failed, falling back:",
          e
        );
      }
    }
    if (
      window.PALAlgorithm &&
      typeof window.PALAlgorithm.getNextDifficulty === "function"
    ) {
      try {
        return window.PALAlgorithm.getNextDifficulty({ state: gameState });
      } catch (e) {
        console.warn("PALAlgorithm.getNextDifficulty failed, falling back:", e);
      }
    }
    // Fallback: sample from computed probs
    const rand = Math.random();
    let cumulative = 0;
    for (const [difficulty, prob] of Object.entries(probs)) {
      cumulative += prob;
      if (rand <= cumulative) return difficulty;
    }
    return "Easy";
  }

  function updateConfidenceLevel(profile) {
    if (profile.difficultyHistory.length < 3) return;

    const recent = profile.difficultyHistory.slice(-5);
    const accuracyVariance = calculateVariance(
      recent.map((q) => (q.correct ? 1 : 0))
    );
    const responseTimeVariance = calculateVariance(
      recent.map((q) => q.responseTime)
    );

    // Lower variance = higher confidence
    const accuracyConfidence = Math.max(0, 1 - accuracyVariance * 2);
    const timingConfidence = Math.max(0, 1 - responseTimeVariance / 10000); // Normalize

    profile.confidenceLevel = (accuracyConfidence + timingConfidence) / 2;
  }

  function updateAdaptationRate(profile) {
    // Faster adaptation for consistent performers, slower for inconsistent
    const consistency = profile.confidenceLevel;
    const sessionProgress = Math.min(1, profile.difficultyHistory.length / 10);

    profile.adaptationRate = 0.3 + consistency * sessionProgress * 0.4;
  }

  function calculateAccuracy(results) {
    if (results.length === 0) return 0.5;
    return (
      results.reduce((sum, correct) => sum + (correct ? 1 : 0), 0) /
      results.length
    );
  }

  function calculateBaseProbabilities(score) {
    if (score <= 20) {
      return { Easy: 0.85, Medium: 0.12, Hard: 0.03 };
    } else if (score <= 35) {
      return { Easy: 0.75, Medium: 0.2, Hard: 0.05 };
    } else if (score <= 50) {
      return { Easy: 0.55, Medium: 0.35, Hard: 0.1 };
    } else if (score <= 65) {
      return { Easy: 0.35, Medium: 0.45, Hard: 0.2 };
    } else if (score <= 80) {
      return { Easy: 0.2, Medium: 0.45, Hard: 0.35 };
    } else if (score <= 90) {
      return { Easy: 0.1, Medium: 0.35, Hard: 0.55 };
    } else {
      return { Easy: 0.05, Medium: 0.25, Hard: 0.7 };
    }
  }

  function adjustForRecentPerformance(probs, profile) {
    const recentHistory = profile.difficultyHistory.slice(-4); // Look at last 4 instead of 3
    if (recentHistory.length === 0) return probs;

    const recentAccuracy =
      recentHistory.reduce((sum, item) => sum + (item.correct ? 1 : 0), 0) /
      recentHistory.length;

    // STABILITY BUFFER: More conservative thresholds
    if (recentAccuracy >= 0.75 && recentHistory.length >= 4) {
      // Very high recent performance - gradual difficulty increase
      const performanceBonus = 1 + (recentAccuracy - 0.75) * 0.8; // Less aggressive
      probs.Easy *= 0.85;
      probs.Medium *= 0.95;
      probs.Hard *= performanceBonus;
      console.log(
        `🎯 Strong recent performance (${(recentAccuracy * 100).toFixed(
          0
        )}%) - gradual challenge increase`
      );
    } else if (recentAccuracy <= 0.25 && recentHistory.length >= 3) {
      // Very poor recent performance - provide support but not immediately drastic
      probs.Easy *= 1.3;
      probs.Medium *= 0.9;
      probs.Hard *= 0.7;
      console.log(
        `📉 Weak recent performance (${(recentAccuracy * 100).toFixed(
          0
        )}%) - providing measured support`
      );
    } else if (recentAccuracy >= 0.25 && recentAccuracy < 0.75) {
      // LEARNING ZONE: 25-75% accuracy - maintain current difficulty for practice
      console.log(
        `⚖️ Learning zone (${(recentAccuracy * 100).toFixed(
          0
        )}%) - maintaining current difficulty`
      );
      // Slight bias toward their current performance level
      if (recentAccuracy > 0.5) {
        probs.Medium *= 1.05; // Slight preference for medium
      }
    }

    return probs;
  }

  function adjustForResponseTime(probs, profile) {
    if (profile.responseTime.length < 2) return probs;

    const avgResponseTime =
      profile.responseTime.reduce((a, b) => a + b, 0) /
      profile.responseTime.length;
    const recentResponseTime =
      profile.responseTime.slice(-2).reduce((a, b) => a + b, 0) / 2;

    // If answering much faster than average, might be too easy
    if (recentResponseTime < avgResponseTime * 0.6) {
      probs.Easy *= 0.8;
      probs.Hard *= 1.2;
    }
    // If answering much slower, might be too hard
    else if (recentResponseTime > avgResponseTime * 1.5) {
      probs.Easy *= 1.2;
      probs.Hard *= 0.8;
    }

    return probs;
  }

  function adjustForAccuracyPatterns(probs, profile) {
    const easyAccuracy = calculateAccuracy(profile.accuracyByDifficulty.Easy);
    const mediumAccuracy = calculateAccuracy(
      profile.accuracyByDifficulty.Medium
    );
    const hardAccuracy = calculateAccuracy(profile.accuracyByDifficulty.Hard);

    const easyCount = profile.accuracyByDifficulty.Easy.length;
    const mediumCount = profile.accuracyByDifficulty.Medium.length;
    const hardCount = profile.accuracyByDifficulty.Hard.length;

    // BUFFER SYSTEM: Need more attempts before making major adjustments

    // Easy questions: Only reduce after mastery is clearly demonstrated
    if (easyAccuracy >= 0.85 && easyCount >= 4) {
      const masteryLevel = Math.min(1.5, 1 + (easyAccuracy - 0.85) * 2);
      probs.Easy *= 0.8 / masteryLevel;
      probs.Medium *= 1.1;
      console.log(
        `🎯 Easy mastery detected (${(easyAccuracy * 100).toFixed(
          0
        )}% over ${easyCount} questions)`
      );
    }

    // Medium questions: More nuanced adjustment with buffer
    if (mediumCount >= 3) {
      if (mediumAccuracy <= 0.25) {
        // Very poor performance - provide significant support but not immediately
        probs.Easy *= 1.4;
        probs.Medium *= 0.7;
        probs.Hard *= 0.5;
        console.log(
          `📉 Medium struggling detected (${(mediumAccuracy * 100).toFixed(
            0
          )}% over ${mediumCount} questions) - providing support`
        );
      } else if (mediumAccuracy >= 0.8 && mediumCount >= 4) {
        // Strong performance - gradually increase challenge
        probs.Medium *= 0.9;
        probs.Hard *= 1.2;
        console.log(
          `📈 Medium mastery detected (${(mediumAccuracy * 100).toFixed(
            0
          )}% over ${mediumCount} questions) - increasing challenge`
        );
      }
      // BUFFER ZONE: 25%-80% accuracy = no major changes, let them practice
      else if (mediumAccuracy > 0.25 && mediumAccuracy < 0.8) {
        console.log(
          `⚖️ Medium practice zone (${(mediumAccuracy * 100).toFixed(
            0
          )}% over ${mediumCount} questions) - maintaining difficulty`
        );
      }
    }

    // Hard questions: Conservative approach with larger buffer
    if (hardCount >= 3) {
      if (hardAccuracy >= 0.75) {
        // Excellent performance on hard - they're ready for more
        probs.Hard *= 1.25;
        probs.Easy *= 0.85;
        console.log(
          `🔥 Hard mastery detected (${(hardAccuracy * 100).toFixed(
            0
          )}% over ${hardCount} questions)`
        );
      } else if (hardAccuracy <= 0.2 && hardCount >= 4) {
        // Really struggling with hard questions - step back gradually
        probs.Hard *= 0.6;
        probs.Medium *= 1.2;
        console.log(
          `🛡️ Hard difficulty too high (${(hardAccuracy * 100).toFixed(
            0
          )}% over ${hardCount} questions) - reducing`
        );
      }
    }

    return probs;
  }

  function adjustForStreakMomentum(probs, streak, lastDiff) {
    // ENHANCED BUFFER SYSTEM FOR STREAKS

    // Positive momentum: Build up gradually
    if (streak >= 5) {
      const streakBonus = Math.min(1.4, 1 + (streak - 4) * 0.08); // More gradual increase
      probs.Hard *= streakBonus;
      probs.Easy *= 2 - streakBonus;
      console.log(
        `🔥 Hot streak (${streak}) - difficulty boost: ${streakBonus.toFixed(
          2
        )}x`
      );
    } else if (streak >= 3) {
      // Moderate streak - small boost
      probs.Hard *= 1.1;
      probs.Easy *= 0.95;
      console.log(`📈 Good streak (${streak}) - slight difficulty increase`);
    }

    // Negative momentum: Provide buffer before major changes
    const consecutiveWrong = gameState.learnerProfile.consecutiveWrong;
    if (consecutiveWrong >= 3) {
      // Significant struggle - provide substantial support
      probs.Easy *= 1.5;
      probs.Hard *= 0.4;
      console.log(
        `🆘 Major struggle (${consecutiveWrong} wrong) - providing strong support`
      );
    } else if (consecutiveWrong === 2) {
      // Minor struggle - gentle support
      probs.Easy *= 1.2;
      probs.Hard *= 0.8;
      console.log(
        `⚠️ Minor struggle (${consecutiveWrong} wrong) - gentle support`
      );
    }

    // Context-aware difficulty stepping
    if (lastDiff === "Hard") {
      const lastResult =
        gameState.learnerProfile.difficultyHistory.slice(-1)[0];
      if (!lastResult.correct) {
        // Failed hard question - but check if it's part of a pattern
        const recentHardAttempts = gameState.learnerProfile.difficultyHistory
          .slice(-4)
          .filter((q) => q.difficulty === "Hard");

        if (recentHardAttempts.length >= 2) {
          const hardFailureRate =
            recentHardAttempts.filter((q) => !q.correct).length /
            recentHardAttempts.length;
          if (hardFailureRate >= 0.5) {
            probs.Hard *= 0.4;
            probs.Medium *= 1.4;
            console.log(
              `📉 Hard questions too difficult (${(
                hardFailureRate * 100
              ).toFixed(0)}% failure) - stepping down`
            );
          }
        }
      }
    } else if (lastDiff === "Medium") {
      const lastResult =
        gameState.learnerProfile.difficultyHistory.slice(-1)[0];
      if (!lastResult.correct) {
        // Failed medium - check for pattern before stepping down
        const recentMediumAttempts = gameState.learnerProfile.difficultyHistory
          .slice(-3)
          .filter((q) => q.difficulty === "Medium");

        if (recentMediumAttempts.length >= 2) {
          const mediumFailureRate =
            recentMediumAttempts.filter((q) => !q.correct).length /
            recentMediumAttempts.length;
          if (mediumFailureRate >= 0.67) {
            // 2/3 failure rate
            probs.Easy *= 1.3;
            probs.Medium *= 0.8;
            console.log(
              `📉 Medium questions challenging (${(
                mediumFailureRate * 100
              ).toFixed(0)}% failure) - providing easier options`
            );
          }
        }
      }
    }

    return probs;
  }

  function adjustForLearningVelocity(probs, profile) {
    // If improving rapidly, challenge more
    if (profile.learningVelocity > 0.3) {
      probs.Hard *= 1.2;
      probs.Easy *= 0.8;
    }
    // If declining, support more
    else if (profile.learningVelocity < -0.3) {
      probs.Easy *= 1.2;
      probs.Hard *= 0.8;
    }

    return probs;
  }

  function adjustForConfidence(probs, profile) {
    // Low confidence - be more conservative
    if (profile.confidenceLevel < 0.3) {
      probs.Easy *= 1.1;
      probs.Hard *= 0.9;
    }
    // High confidence - can take more risks
    else if (profile.confidenceLevel > 0.8) {
      probs.Hard *= 1.1;
      probs.Easy *= 0.9;
    }

    return probs;
  }

  function applySmoothingBuffer(probs, profile) {
    // Prevent dramatic difficulty jumps by comparing to recent difficulty distribution
    if (profile.difficultyHistory.length < 3) return probs;

    const recentDifficulties = profile.difficultyHistory.slice(-5);
    const recentDistribution = {
      Easy:
        recentDifficulties.filter((q) => q.difficulty === "Easy").length /
        recentDifficulties.length,
      Medium:
        recentDifficulties.filter((q) => q.difficulty === "Medium").length /
        recentDifficulties.length,
      Hard:
        recentDifficulties.filter((q) => q.difficulty === "Hard").length /
        recentDifficulties.length,
    };

    // Limit how much probabilities can change from recent pattern
    const maxChange = 0.4; // Maximum 40% change in probability
    const smoothingFactor = 0.7; // How much to blend with recent pattern

    probs.Easy =
      probs.Easy * (1 - smoothingFactor) +
      recentDistribution.Easy * smoothingFactor;
    probs.Medium =
      probs.Medium * (1 - smoothingFactor) +
      recentDistribution.Medium * smoothingFactor;
    probs.Hard =
      probs.Hard * (1 - smoothingFactor) +
      recentDistribution.Hard * smoothingFactor;

    // Ensure no probability goes negative or exceeds reasonable bounds
    probs.Easy = Math.max(0.05, Math.min(0.8, probs.Easy));
    probs.Medium = Math.max(0.1, Math.min(0.6, probs.Medium));
    probs.Hard = Math.max(0.05, Math.min(0.7, probs.Hard));

    console.log(
      "🔧 Smoothing buffer applied - preventing dramatic difficulty swings"
    );

    return probs;
  }

  function calculateVariance(values) {
    if (values.length < 2) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return (
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      values.length
    );
  }

  return null;
}

export default HybridLearner;
