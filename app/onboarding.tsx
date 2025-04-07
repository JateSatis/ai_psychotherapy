import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  useWindowDimensions,
  TouchableOpacity,
  Animated,
  ScrollView,
  Platform,
  Pressable,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { theme } from '@/constants/theme';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/store/auth-store';
import { Brain, CheckCircle, ArrowLeft, Lock } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useOnboardingStore } from '@/store/onboarding-store';
import { Picker } from '@/components/Picker';

const OnboardingScreen = () => {
  const { width } = useWindowDimensions();
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const { completeOnboarding, setUser } = useAuthStore();
  const { 
    setFocusArea, 
    setTherapyExperience, 
    setOverwhelmedFrequency,
    setAge,
    setGender,
    focusArea,
    therapyExperience,
    overwhelmedFrequency,
    age,
    gender
  } = useOnboardingStore();
  
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const [loadingProgress] = useState(new Animated.Value(0));
  const [showPaywall, setShowPaywall] = useState(false);
  const [showExitOffer, setShowExitOffer] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  
  // Animation for the brain in loading screen
  const brainScale = useRef(new Animated.Value(1)).current;
  const brainOpacity = useRef(new Animated.Value(0.7)).current;
  
  useEffect(() => {
    if (currentStep === 9) { // Loading screen
      // Start progress animation
      Animated.timing(loadingProgress, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }).start(() => {
        // Move to next screen after loading completes
        setTimeout(() => {
          handleNext();
        }, 500);
      });
      
      // Pulsating brain animation
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(brainScale, {
              toValue: 1.1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(brainOpacity, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(brainScale, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(brainOpacity, {
              toValue: 0.7,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    }
  }, [currentStep]);
  
  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      flatListRef.current?.scrollToIndex({
        index: currentStep + 1,
        animated: true,
      });
    } else {
      handleComplete();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      flatListRef.current?.scrollToIndex({
        index: currentStep - 1,
        animated: true,
      });
    }
  };
  
  const handleComplete = () => {
    if (showPaywall) {
      completeOnboarding();
      setUser({
        id: '1',
        name: 'User',
        email: 'user@example.com',
        onboardingCompleted: true,
      });
      router.replace('/(tabs)');
    } else {
      setShowPaywall(true);
    }
  };
  
  const handleSkip = () => {
    if (currentStep >= 5 && currentStep < 9) {
      setCurrentStep(9);
      flatListRef.current?.scrollToIndex({
        index: 9,
        animated: true,
      });
    } else {
      handleComplete();
    }
  };
  
  const handleTryExit = () => {
    if (showPaywall && !showExitOffer) {
      setShowExitOffer(true);
    } else {
      completeOnboarding();
      setUser({
        id: '1',
        name: 'User',
        email: 'user@example.com',
        onboardingCompleted: true,
      });
      router.replace('/(tabs)');
    }
  };
  
  const handleSelectFocusArea = (area: string) => {
    setFocusArea(area);
    handleNext();
  };
  
  const handleSelectTherapyExperience = (experience: string) => {
    setTherapyExperience(experience);
    handleNext();
  };
  
  const handleSelectOverwhelmedFrequency = (frequency: string) => {
    setOverwhelmedFrequency(frequency);
    handleNext();
  };
  
  const handleSelectAge = (selectedAge: number) => {
    setAge(selectedAge);
  };
  
  const handleSelectGender = (selectedGender: string) => {
    setGender(selectedGender);
  };
  
  const handleDemographicsContinue = () => {
    if (age && gender) {
      handleNext();
    }
  };
  
  const onboardingSteps = [
    // 1. Splash Screen
    {
      id: 'splash',
      render: () => (
        <View style={styles.stepContainer}>
          <View style={styles.brainLogoContainer}>
            <Brain size={80} color={colors.primary} />
          </View>
          <Text style={styles.brandTitle}>🧠 AI Psychotherapy Assistant</Text>
          <Button
            title="Get Started"
            onPress={handleNext}
            variant="primary"
            size="large"
            style={styles.button}
          />
        </View>
      )
    },
    // 2. Problem Statement
    {
      id: 'problem',
      render: () => (
        <View style={styles.stepContainer}>
          <Text style={styles.largeTitle}>Feeling stuck, anxious, or emotionally overwhelmed?</Text>
          <Button
            title="Continue"
            onPress={handleNext}
            variant="primary"
            size="large"
            style={styles.button}
          />
        </View>
      )
    },
    // 3. AI Promise
    {
      id: 'promise',
      render: () => (
        <View style={styles.stepContainer}>
          <Text style={styles.largeTitle}>AI Psychotherapy Assistant supports you 24/7 — anytime, anywhere.</Text>
          <Button
            title="Continue"
            onPress={handleNext}
            variant="primary"
            size="large"
            style={styles.button}
          />
        </View>
      )
    },
    // 4. Social Proof
    {
      id: 'social-proof',
      render: () => (
        <View style={styles.stepContainer}>
          <Text style={styles.mediumTitle}>Built with licensed therapists.</Text>
          <View style={styles.therapistContainer}>
            <View style={styles.therapistBadge}>
              <CheckCircle size={24} color={colors.success} style={styles.checkIcon} />
              <Text style={styles.therapistText}>Evidence-based approaches</Text>
            </View>
            <View style={styles.therapistBadge}>
              <CheckCircle size={24} color={colors.success} style={styles.checkIcon} />
              <Text style={styles.therapistText}>CBT techniques</Text>
            </View>
            <View style={styles.therapistBadge}>
              <CheckCircle size={24} color={colors.success} style={styles.checkIcon} />
              <Text style={styles.therapistText}>Mindfulness practices</Text>
            </View>
          </View>
          <Button
            title="Continue"
            onPress={handleNext}
            variant="primary"
            size="large"
            style={styles.button}
          />
        </View>
      )
    },
    // 5. How It Works
    {
      id: 'how-it-works',
      render: () => (
        <View style={styles.stepContainer}>
          <Text style={styles.mediumTitle}>Chat with AI trained on thousands of therapeutic conversations and CBT tools.</Text>
          <View style={styles.howItWorksImage}>
            <Brain size={100} color={colors.primary} />
          </View>
          <Button
            title="Continue"
            onPress={handleNext}
            variant="primary"
            size="large"
            style={styles.button}
          />
        </View>
      )
    },
    // 6. First Engagement Question
    {
      id: 'engagement',
      render: () => (
        <View style={styles.stepContainer}>
          <Text style={styles.questionTitle}>What would you like to work on first?</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={[styles.optionButton, focusArea === 'Anxiety' && styles.selectedOption]} 
              onPress={() => handleSelectFocusArea('Anxiety')}
            >
              <Text style={[styles.optionText, focusArea === 'Anxiety' && styles.selectedOptionText]}>Anxiety</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.optionButton, focusArea === 'Mood' && styles.selectedOption]} 
              onPress={() => handleSelectFocusArea('Mood')}
            >
              <Text style={[styles.optionText, focusArea === 'Mood' && styles.selectedOptionText]}>Mood</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.optionButton, focusArea === 'Motivation' && styles.selectedOption]} 
              onPress={() => handleSelectFocusArea('Motivation')}
            >
              <Text style={[styles.optionText, focusArea === 'Motivation' && styles.selectedOptionText]}>Motivation</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.optionButton, focusArea === 'Relationships' && styles.selectedOption]} 
              onPress={() => handleSelectFocusArea('Relationships')}
            >
              <Text style={[styles.optionText, focusArea === 'Relationships' && styles.selectedOptionText]}>Relationships</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    },
    // 7. Personalization 1 - Therapy Experience
    {
      id: 'personalization-1',
      render: () => (
        <View style={styles.stepContainer}>
          <Text style={styles.questionTitle}>Have you ever talked to a therapist before?</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={[styles.optionButton, therapyExperience === 'Currently' && styles.selectedOption]} 
              onPress={() => handleSelectTherapyExperience('Currently')}
            >
              <Text style={[styles.optionText, therapyExperience === 'Currently' && styles.selectedOptionText]}>Yes, I currently do</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.optionButton, therapyExperience === 'Past' && styles.selectedOption]} 
              onPress={() => handleSelectTherapyExperience('Past')}
            >
              <Text style={[styles.optionText, therapyExperience === 'Past' && styles.selectedOptionText]}>Yes, in the past</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.optionButton, therapyExperience === 'Never' && styles.selectedOption]} 
              onPress={() => handleSelectTherapyExperience('Never')}
            >
              <Text style={[styles.optionText, therapyExperience === 'Never' && styles.selectedOptionText]}>Never</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      )
    },
    // 8. Personalization 2 - Overwhelmed Frequency
    {
      id: 'personalization-2',
      render: () => (
        <View style={styles.stepContainer}>
          <Text style={styles.questionTitle}>How often do you feel emotionally overwhelmed?</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={[styles.optionButton, overwhelmedFrequency === 'Rarely' && styles.selectedOption]} 
              onPress={() => handleSelectOverwhelmedFrequency('Rarely')}
            >
              <Text style={[styles.optionText, overwhelmedFrequency === 'Rarely' && styles.selectedOptionText]}>Rarely</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.optionButton, overwhelmedFrequency === 'Sometimes' && styles.selectedOption]} 
              onPress={() => handleSelectOverwhelmedFrequency('Sometimes')}
            >
              <Text style={[styles.optionText, overwhelmedFrequency === 'Sometimes' && styles.selectedOptionText]}>Sometimes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.optionButton, overwhelmedFrequency === 'Often' && styles.selectedOption]} 
              onPress={() => handleSelectOverwhelmedFrequency('Often')}
            >
              <Text style={[styles.optionText, overwhelmedFrequency === 'Often' && styles.selectedOptionText]}>Often</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.optionButton, overwhelmedFrequency === 'Almost every day' && styles.selectedOption]} 
              onPress={() => handleSelectOverwhelmedFrequency('Almost every day')}
            >
              <Text style={[styles.optionText, overwhelmedFrequency === 'Almost every day' && styles.selectedOptionText]}>Almost every day</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      )
    },
    // 9. Additional Personalization - Demographics
    {
      id: 'demographics',
      render: () => (
        <View style={styles.stepContainer}>
          <Text style={styles.questionTitle}>Just a few more details to personalize your experience</Text>
          
          <View style={styles.demographicContainer}>
            <Text style={styles.demographicLabel}>How old are you?</Text>
            <Picker
              selectedValue={age || 25}
              onValueChange={handleSelectAge}
              items={Array.from({ length: 83 }, (_, i) => ({ label: `${i + 18}`, value: i + 18 }))}
            />
          </View>
          
          <View style={styles.demographicContainer}>
            <Text style={styles.demographicLabel}>What's your gender?</Text>
            <View style={styles.genderOptions}>
              <TouchableOpacity 
                style={[styles.genderButton, gender === 'Male' && styles.selectedGender]} 
                onPress={() => handleSelectGender('Male')}
              >
                <Text style={[styles.genderText, gender === 'Male' && styles.selectedGenderText]}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.genderButton, gender === 'Female' && styles.selectedGender]} 
                onPress={() => handleSelectGender('Female')}
              >
                <Text style={[styles.genderText, gender === 'Female' && styles.selectedGenderText]}>Female</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.genderButton, gender === 'Other' && styles.selectedGender]} 
                onPress={() => handleSelectGender('Other')}
              >
                <Text style={[styles.genderText, gender === 'Other' && styles.selectedGenderText]}>Other</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Button
            title="Continue"
            onPress={handleDemographicsContinue}
            variant="primary"
            size="large"
            style={styles.button}
            disabled={!age || !gender}
          />
          
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      )
    },
    // 10. Loading Screen with Animation
    {
      id: 'loading',
      render: () => (
        <View style={styles.loadingContainer}>
          <Animated.View 
            style={[
              styles.brainAnimation, 
              { 
                transform: [{ scale: brainScale }],
                opacity: brainOpacity
              }
            ]}
          >
            <Brain size={100} color={colors.primary} />
          </Animated.View>
          
          <Text style={styles.loadingText}>Creating your personalized AI assistant based on your answers...</Text>
          
          <View style={styles.progressContainer}>
            <Animated.View 
              style={[
                styles.progressBar, 
                { 
                  width: loadingProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  }) 
                }
              ]} 
            />
          </View>
        </View>
      )
    },
    // 11. Goal Setting
    {
      id: 'goal',
      render: () => (
        <View style={styles.stepContainer}>
          <Text style={styles.goalTitle}>Your goal:</Text>
          <Text style={styles.goalText}>Feel more emotionally balanced in just 2 weeks.</Text>
          <Button
            title="Continue"
            onPress={handleNext}
            variant="primary"
            size="large"
            style={styles.button}
          />
        </View>
      )
    },
    // 12. Privacy Assurance
    {
      id: 'privacy',
      render: () => (
        <View style={styles.stepContainer}>
          <View style={styles.privacyIconContainer}>
            <Lock size={60} color={colors.primary} />
          </View>
          <Text style={styles.privacyTitle}>Your data is private.</Text>
          <Text style={styles.privacyText}>Conversations are not stored or shared.</Text>
          <Button
            title="Continue"
            onPress={handleNext}
            variant="primary"
            size="large"
            style={styles.button}
          />
        </View>
      )
    },
  ];
  
  const renderPaywall1 = () => (
    <SafeAreaView style={styles.paywallContainer}>
      <TouchableOpacity style={styles.closeButton} onPress={handleTryExit}>
        <ArrowLeft size={24} color="#000" />
      </TouchableOpacity>
      
      <View style={styles.paywallContent}>
        <Text style={styles.paywallTitle}>We want you to try AI Psychotherapy Assistant for free.</Text>
        
        <View style={styles.noPaymentContainer}>
          <CheckCircle size={18} color="#000" />
          <Text style={styles.noPaymentText}>No Payment Due Now</Text>
        </View>
        
        <Button
          title="Continue for FREE"
          onPress={handleNext}
          variant="primary"
          size="large"
          style={styles.paywallButton}
        />
        
        <Text style={styles.subscriptionNote}>Just $99.99/year after 3-day trial. Cancel anytime.</Text>
      </View>
    </SafeAreaView>
  );
  
  const renderPaywall2 = () => (
    <SafeAreaView style={styles.paywallContainer}>
      <TouchableOpacity style={styles.closeButton} onPress={handleTryExit}>
        <ArrowLeft size={24} color="#000" />
      </TouchableOpacity>
      
      <ScrollView style={styles.paywallScrollContent}>
        <Text style={styles.paywallTitle}>Unlock your personalized AI support system.</Text>
        
        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <CheckCircle size={20} color={colors.primary} style={styles.benefitIcon} />
            <Text style={styles.benefitText}>Chat 24/7 with a smart assistant</Text>
          </View>
          <View style={styles.benefitItem}>
            <CheckCircle size={20} color={colors.primary} style={styles.benefitIcon} />
            <Text style={styles.benefitText}>Get mood tracking & progress insights</Text>
          </View>
          <View style={styles.benefitItem}>
            <CheckCircle size={20} color={colors.primary} style={styles.benefitIcon} />
            <Text style={styles.benefitText}>Access calming tools & techniques</Text>
          </View>
        </View>
        
        <View style={styles.plansContainer}>
          <Pressable 
            style={[styles.planOption, selectedPlan === 'monthly' && styles.selectedPlan]}
            onPress={() => setSelectedPlan('monthly')}
          >
            <View style={styles.planRadio}>
              {selectedPlan === 'monthly' && <View style={styles.planRadioSelected} />}
            </View>
            <View style={styles.planDetails}>
              <Text style={styles.planTitle}>Monthly</Text>
              <Text style={styles.planPrice}>$9.99/mo</Text>
            </View>
          </Pressable>
          
          <Pressable 
            style={[styles.planOption, selectedPlan === 'yearly' && styles.selectedPlan]}
            onPress={() => setSelectedPlan('yearly')}
          >
            <View style={styles.planRadio}>
              {selectedPlan === 'yearly' && <View style={styles.planRadioSelected} />}
            </View>
            <View style={styles.planDetails}>
              <Text style={styles.planTitle}>Yearly</Text>
              <Text style={styles.planPrice}>$99.99/year</Text>
              <View style={styles.saveBadge}>
                <Text style={styles.saveText}>Save 17%</Text>
              </View>
            </View>
          </Pressable>
        </View>
        
        <View style={styles.trialInfoContainer}>
          <View style={styles.trialStep}>
            <View style={styles.trialStepIcon}>
              <Lock size={16} color="#fff" />
            </View>
            <View style={styles.trialStepContent}>
              <Text style={styles.trialStepTitle}>Today</Text>
              <Text style={styles.trialStepText}>Unlock all features and start your journey</Text>
            </View>
          </View>
          
          <View style={[styles.trialStepConnector, styles.trialStepConnectorActive]} />
          
          <View style={styles.trialStep}>
            <View style={styles.trialStepIcon}>
              <Text style={styles.trialStepIconText}>2</Text>
            </View>
            <View style={styles.trialStepContent}>
              <Text style={styles.trialStepTitle}>In 2 Days - Reminder</Text>
              <Text style={styles.trialStepText}>We'll send you a reminder that your trial is ending soon</Text>
            </View>
          </View>
          
          <View style={styles.trialStepConnector} />
          
          <View style={styles.trialStep}>
            <View style={styles.trialStepIcon}>
              <Text style={styles.trialStepIconText}>3</Text>
            </View>
            <View style={styles.trialStepContent}>
              <Text style={styles.trialStepTitle}>In 3 Days - Billing Starts</Text>
              <Text style={styles.trialStepText}>You'll be charged unless you cancel anytime before</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.noPaymentContainer}>
          <CheckCircle size={18} color="#000" />
          <Text style={styles.noPaymentText}>No Payment Due Now</Text>
        </View>
        
        <Button
          title="Start My Free Trial"
          onPress={handleComplete}
          variant="primary"
          size="large"
          style={styles.paywallButton}
        />
        
        <Text style={styles.subscriptionNote}>
          3 days free, then {selectedPlan === 'monthly' ? '$9.99/month' : '$99.99/year'}. Cancel anytime.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
  
  const renderExitOffer = () => (
    <SafeAreaView style={styles.paywallContainer}>
      <View style={styles.exitOfferContent}>
        <Text style={styles.exitOfferTitle}>One-Time Offer: 80% Off Today</Text>
        
        <View style={styles.exitPriceContainer}>
          <Text style={styles.exitPriceLabel}>Only</Text>
          <Text style={styles.exitPrice}>$1.66/month</Text>
          <Text style={styles.exitPriceNote}>billed annually ($19.99/year)</Text>
        </View>
        
        <Button
          title="Claim this now"
          onPress={handleComplete}
          variant="primary"
          size="large"
          style={styles.exitButton}
        />
        
        <TouchableOpacity onPress={handleComplete}>
          <Text style={styles.noThanksText}>No thanks, I'll pay full price later</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
  
  const renderItem = ({ item, index }: { item: any, index: number }) => {
    return (
      <View style={[styles.slide, { width }]}>
        {item.render()}
      </View>
    );
  };
  
  if (showExitOffer) {
    return renderExitOffer();
  }
  
  if (showPaywall) {
    return currentStep === onboardingSteps.length ? renderPaywall2() : renderPaywall1();
  }
  
  return (
    <SafeAreaView style={styles.container}>
      {currentStep > 0 && currentStep < 9 && (
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
      )}
      
      <FlatList
        ref={flatListRef}
        data={onboardingSteps}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />
      
      {currentStep < 5 && (
        <View style={styles.paginationContainer}>
          {onboardingSteps.slice(0, 5).map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];
            
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
              extrapolate: 'clamp',
            });
            
            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.8, 1, 0.8],
              extrapolate: 'clamp',
            });
            
            return (
              <Animated.View
                key={index}
                style={[
                  styles.paginationDot,
                  {
                    opacity,
                    transform: [{ scale }],
                    backgroundColor: index <= currentStep ? colors.primary : colors.inactive,
                  },
                ]}
              />
            );
          })}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    ...theme.shadows.small,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  brainLogoContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    ...theme.shadows.medium,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 40,
    textAlign: 'center',
  },
  largeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 42,
  },
  mediumTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 36,
  },
  button: {
    width: '100%',
    marginTop: 20,
    borderRadius: 16,
    height: 56,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    width: '100%',
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  therapistContainer: {
    width: '100%',
    marginBottom: 30,
  },
  therapistBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    ...theme.shadows.small,
  },
  checkIcon: {
    marginRight: 10,
  },
  therapistText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  howItWorksImage: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 32,
  },
  optionsContainer: {
    width: '100%',
  },
  optionButton: {
    width: '100%',
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#f8f8f8',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    ...theme.shadows.small,
  },
  selectedOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  skipButton: {
    marginTop: 20,
    padding: 10,
  },
  skipText: {
    fontSize: 16,
    color: colors.textLight,
    textDecorationLine: 'underline',
  },
  demographicContainer: {
    width: '100%',
    marginBottom: 20,
  },
  demographicLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    padding: 15,
    borderRadius: 16,
    backgroundColor: '#f8f8f8',
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    ...theme.shadows.small,
  },
  selectedGender: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  selectedGenderText: {
    color: '#fff',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  brainAnimation: {
    marginBottom: 30,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 28,
  },
  progressContainer: {
    width: '80%',
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  goalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  goalText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 36,
  },
  privacyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    ...theme.shadows.small,
  },
  privacyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  privacyText: {
    fontSize: 18,
    color: colors.textLight,
    marginBottom: 40,
    textAlign: 'center',
  },
  paywallContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    ...theme.shadows.small,
  },
  paywallContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  paywallScrollContent: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 80,
    paddingBottom: 30,
  },
  paywallTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 36,
  },
  noPaymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(94, 204, 192, 0.1)',
    padding: 12,
    borderRadius: 12,
    width: '100%',
  },
  noPaymentText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  paywallButton: {
    width: '100%',
    marginBottom: 15,
    height: 56,
    borderRadius: 16,
  },
  subscriptionNote: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  benefitsContainer: {
    marginBottom: 30,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    ...theme.shadows.small,
  },
  benefitIcon: {
    marginRight: 10,
  },
  benefitText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  plansContainer: {
    marginBottom: 30,
  },
  planOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 16,
    marginBottom: 15,
    ...theme.shadows.small,
  },
  selectedPlan: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(94, 204, 192, 0.1)',
  },
  planRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  planRadioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  planDetails: {
    flex: 1,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  planPrice: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 4,
  },
  saveBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  saveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  trialInfoContainer: {
    marginBottom: 30,
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 16,
    ...theme.shadows.small,
  },
  trialStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  trialStepIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  trialStepIconText: {
    color: '#fff',
    fontWeight: '600',
  },
  trialStepContent: {
    flex: 1,
  },
  trialStepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 5,
  },
  trialStepText: {
    fontSize: 14,
    color: colors.textLight,
  },
  trialStepConnector: {
    width: 2,
    height: 20,
    backgroundColor: '#e0e0e0',
    marginLeft: 15,
    marginBottom: 15,
  },
  trialStepConnectorActive: {
    backgroundColor: colors.primary,
  },
  exitOfferContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  exitOfferTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 36,
  },
  exitPriceContainer: {
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: 'rgba(94, 204, 192, 0.1)',
    padding: 24,
    borderRadius: 16,
    width: '100%',
  },
  exitPriceLabel: {
    fontSize: 18,
    color: colors.textLight,
  },
  exitPrice: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.primary,
    marginVertical: 10,
  },
  exitPriceNote: {
    fontSize: 14,
    color: colors.textLight,
  },
  exitButton: {
    width: '100%',
    marginBottom: 20,
    height: 56,
    borderRadius: 16,
  },
  noThanksText: {
    fontSize: 16,
    color: colors.textLight,
    textDecorationLine: 'underline',
    marginTop: 10,
  },
});

export default OnboardingScreen;