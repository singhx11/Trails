"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  UserRole,
  Organization,
  CreatorProfile,
  Campaign,
  Submission,
  PayoutRecord,
  DisputeRecord,
  PlatformNotification,
  AuditLog,
  LeaderboardEntry,
} from "@/types";
import {
  INITIAL_USERS,
  INITIAL_ORGANIZATIONS,
  INITIAL_CREATOR_PROFILES,
  INITIAL_CAMPAIGNS,
  INITIAL_SUBMISSIONS,
  INITIAL_PAYOUTS,
  INITIAL_DISPUTES,
  INITIAL_AUDIT_LOGS,
} from "@/lib/mockData";
import { runAutomatedVerification } from "@/lib/verificationEngine";
import { calculatePrizePool, calculateConfigurablePrizePool } from "@/lib/utils";

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  organizations: Organization[];
  creatorProfiles: CreatorProfile[];
  campaigns: Campaign[];
  submissions: Submission[];
  payouts: PayoutRecord[];
  disputes: DisputeRecord[];
  auditLogs: AuditLog[];
  notifications: PlatformNotification[];
  login: (email: string, role?: UserRole) => boolean;
  register: (name: string, email: string, role: UserRole) => User;
  logout: () => void;
  submitCreatorVerification: (data: {
    handle: string;
    bio: string;
    categories: string[];
    instagram?: string;
    youtube?: string;
    govIdType: string;
    govIdNumber: string;
    portfolioUrl?: string;
  }) => void;
  submitOrganizerVerification: (data: {
    orgName: string;
    category: string;
    website: string;
    businessRegistrationNumber: string;
    gstNumber: string;
    officialEmail: string;
  }) => void;
  createCampaign: (campaignData: Partial<Campaign>) => Campaign;
  fundCampaign: (campaignId: string, paymentMethod: string) => Promise<boolean>;
  enrollInCampaign: (campaignId: string, creatorId: string) => boolean;
  submitContent: (
    campaignId: string,
    creatorId: string,
    contentUrl: string,
    platform: "Instagram" | "YouTube",
    caption: string,
    notes?: string
  ) => Promise<Submission>;
  getCampaignLeaderboard: (campaignId: string) => LeaderboardEntry[];
  approveCampaignAdmin: (campaignId: string) => void;
  moderateSubmissionAdmin: (
    submissionId: string,
    status: "approved" | "rejected" | "disqualified",
    notes?: string
  ) => void;
  resolveDisputeAdmin: (disputeId: string, resolution: string) => void;
  processPayoutAdmin: (payoutId: string) => void;
  finalizeCampaignResults: (campaignId: string) => void;
  addNotification: (userId: string, title: string, message: string, type: any) => void;
  resetToSampleData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: "creatorbid_users_v1",
  ORGANIZATIONS: "creatorbid_orgs_v1",
  CREATOR_PROFILES: "creatorbid_creators_v1",
  CAMPAIGNS: "creatorbid_campaigns_v1",
  SUBMISSIONS: "creatorbid_submissions_v1",
  PAYOUTS: "creatorbid_payouts_v1",
  DISPUTES: "creatorbid_disputes_v1",
  LOGS: "creatorbid_logs_v1",
  CURRENT_USER_ID: "creatorbid_curr_user_v1",
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // default organizer
  const [organizations, setOrganizations] = useState<Organization[]>(INITIAL_ORGANIZATIONS);
  const [creatorProfiles, setCreatorProfiles] = useState<CreatorProfile[]>(INITIAL_CREATOR_PROFILES);
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [payouts, setPayouts] = useState<PayoutRecord[]>(INITIAL_PAYOUTS);
  const [disputes, setDisputes] = useState<DisputeRecord[]>(INITIAL_DISPUTES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<PlatformNotification[]>([
    {
      id: "notif-1",
      userId: "user-creator-1",
      title: "Submission Approved",
      message: "Your submission for 'Apex Cloud AI' passed verification checks and is now on the provisional leaderboard!",
      timestamp: "2026-10-05T14:25:00Z",
      read: false,
      type: "submission",
    },
    {
      id: "notif-2",
      userId: "user-org-1",
      title: "New Submission Received",
      message: "Rohan Sharma submitted a compliant Instagram Reel for 'Apex Cloud AI'.",
      timestamp: "2026-10-05T14:20:00Z",
      read: true,
      type: "campaign",
    },
  ]);

  // Load from local storage
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      const storedOrgs = localStorage.getItem(STORAGE_KEYS.ORGANIZATIONS);
      const storedCreators = localStorage.getItem(STORAGE_KEYS.CREATOR_PROFILES);
      const storedCampaigns = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
      const storedSubmissions = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      const storedPayouts = localStorage.getItem(STORAGE_KEYS.PAYOUTS);
      const storedDisputes = localStorage.getItem(STORAGE_KEYS.DISPUTES);
      const storedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);
      const storedUserId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);

      if (storedUsers) setUsers(JSON.parse(storedUsers));
      if (storedOrgs) setOrganizations(JSON.parse(storedOrgs));
      if (storedCreators) setCreatorProfiles(JSON.parse(storedCreators));
      if (storedCampaigns) setCampaigns(JSON.parse(storedCampaigns));
      if (storedSubmissions) setSubmissions(JSON.parse(storedSubmissions));
      if (storedPayouts) setPayouts(JSON.parse(storedPayouts));
      if (storedDisputes) setDisputes(JSON.parse(storedDisputes));
      if (storedLogs) setAuditLogs(JSON.parse(storedLogs));
      if (storedUserId) {
        const userList = storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS;
        const found = userList.find((u: User) => u.id === storedUserId);
        if (found) setCurrentUser(found);
      }
    } catch {
      // Fallback to initial seeds
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch {}
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORGANIZATIONS, JSON.stringify(organizations));
    } catch {}
  }, [organizations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CREATOR_PROFILES, JSON.stringify(creatorProfiles));
    } catch {}
  }, [creatorProfiles]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
    } catch {}
  }, [campaigns]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
    } catch {}
  }, [submissions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PAYOUTS, JSON.stringify(payouts));
    } catch {}
  }, [payouts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUser.id);
    } catch {}
  }, [currentUser]);

  const addNotification = (userId: string, title: string, message: string, type: any) => {
    const newNotif: PlatformNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      userId,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      type,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const addAuditLog = (action: string, role: string, entity: string, entityId: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action,
      performedBy: currentUser.name,
      role,
      targetEntity: entity,
      targetId: entityId,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Authentication functions
  const login = (email: string, role?: UserRole): boolean => {
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      addNotification(existing.id, "Logged In", `Welcome back, ${existing.name}!`, "campaign");
      return true;
    }

    // Auto-create user if not found with specified role
    const newUserRole: UserRole = role || "creator";
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
      email,
      role: newUserRole,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80`,
      createdAt: new Date().toISOString(),
      organizationId: newUserRole === "organizer" ? `org-${Date.now()}` : undefined,
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);

    if (newUserRole === "organizer") {
      const newOrg: Organization = {
        id: newUser.organizationId!,
        userId: newUser.id,
        name: `${newUser.name}'s Org`,
        logo: newUser.avatarUrl,
        category: "technology",
        website: "https://example.com",
        verified: false,
        verificationStatus: "unverified",
        totalFunded: 0,
        activeCampaignsCount: 0,
      };
      setOrganizations(prev => [...prev, newOrg]);
    } else if (newUserRole === "creator") {
      const newProfile: CreatorProfile = {
        id: `cp-${Date.now()}`,
        userId: newUser.id,
        displayName: newUser.name,
        handle: `@${email.split("@")[0]}`,
        bio: "Creative storyteller & video producer.",
        categories: ["technology", "education"],
        totalEarnings: 0,
        rankingsWon: 0,
        connectedAccounts: {},
        verifiedIdentity: false,
        verificationStatus: "unverified",
      };
      setCreatorProfiles(prev => [...prev, newProfile]);
    }

    addNotification(newUser.id, "Account Created", `Welcome to CreatorBid! Please complete profile verification.`, "campaign");
    return true;
  };

  const register = (name: string, email: string, role: UserRole): User => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80`,
      createdAt: new Date().toISOString(),
      organizationId: role === "organizer" ? `org-${Date.now()}` : undefined,
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);

    if (role === "organizer") {
      const newOrg: Organization = {
        id: newUser.organizationId!,
        userId: newUser.id,
        name,
        logo: newUser.avatarUrl,
        category: "technology",
        website: "",
        verified: false,
        verificationStatus: "unverified",
        totalFunded: 0,
        activeCampaignsCount: 0,
      };
      setOrganizations(prev => [...prev, newOrg]);
    } else if (role === "creator") {
      const newProfile: CreatorProfile = {
        id: `cp-${Date.now()}`,
        userId: newUser.id,
        displayName: name,
        handle: `@${name.toLowerCase().replace(/\s+/g, "_")}`,
        bio: "Content creator exploring brand campaigns.",
        categories: ["lifestyle", "technology"],
        totalEarnings: 0,
        rankingsWon: 0,
        connectedAccounts: {},
        verifiedIdentity: false,
        verificationStatus: "unverified",
      };
      setCreatorProfiles(prev => [...prev, newProfile]);
    }

    return newUser;
  };

  const logout = () => {
    // Switch to first default or public state
    if (users.length > 0) {
      setCurrentUser(users[0]);
    }
  };

  // Profile Verification Functions
  const submitCreatorVerification = (data: {
    handle: string;
    bio: string;
    categories: string[];
    instagram?: string;
    youtube?: string;
    govIdType: string;
    govIdNumber: string;
    portfolioUrl?: string;
  }) => {
    setCreatorProfiles(prev => {
      const existing = prev.find(p => p.userId === currentUser.id);
      if (existing) {
        return prev.map(p =>
          p.userId === currentUser.id
            ? {
                ...p,
                handle: data.handle,
                bio: data.bio,
                categories: data.categories,
                connectedAccounts: {
                  instagram: data.instagram,
                  youtube: data.youtube,
                },
                govIdType: data.govIdType,
                govIdNumber: data.govIdNumber,
                portfolioUrl: data.portfolioUrl,
                verifiedIdentity: true,
                verificationStatus: "verified",
                verificationSubmittedAt: new Date().toISOString(),
              }
            : p
        );
      } else {
        const newCP: CreatorProfile = {
          id: `cp-${Date.now()}`,
          userId: currentUser.id,
          displayName: currentUser.name,
          handle: data.handle,
          bio: data.bio,
          categories: data.categories,
          totalEarnings: 0,
          rankingsWon: 0,
          connectedAccounts: {
            instagram: data.instagram,
            youtube: data.youtube,
          },
          govIdType: data.govIdType,
          govIdNumber: data.govIdNumber,
          portfolioUrl: data.portfolioUrl,
          verifiedIdentity: true,
          verificationStatus: "verified",
          verificationSubmittedAt: new Date().toISOString(),
        };
        return [...prev, newCP];
      }
    });

    addNotification(
      currentUser.id,
      "Identity Verified",
      "Your Creator badge has been approved! You are now eligible to enroll in all verified brand campaigns.",
      "campaign"
    );

    addAuditLog(
      "CREATOR_VERIFIED",
      "system",
      "creator_profile",
      currentUser.id,
      `Creator ${currentUser.name} verified identity via ${data.govIdType} (handle: ${data.handle})`
    );
  };

  const submitOrganizerVerification = (data: {
    orgName: string;
    category: string;
    website: string;
    businessRegistrationNumber: string;
    gstNumber: string;
    officialEmail: string;
  }) => {
    setOrganizations(prev => {
      const existing = prev.find(o => o.userId === currentUser.id);
      if (existing) {
        return prev.map(o =>
          o.userId === currentUser.id
            ? {
                ...o,
                name: data.orgName,
                category: data.category,
                website: data.website,
                businessRegistrationNumber: data.businessRegistrationNumber,
                gstNumber: data.gstNumber,
                officialEmail: data.officialEmail,
                verified: true,
                verificationStatus: "verified",
                verificationSubmittedAt: new Date().toISOString(),
              }
            : o
        );
      } else {
        const newOrg: Organization = {
          id: currentUser.organizationId || `org-${Date.now()}`,
          userId: currentUser.id,
          name: data.orgName,
          logo: currentUser.avatarUrl,
          category: data.category,
          website: data.website,
          businessRegistrationNumber: data.businessRegistrationNumber,
          gstNumber: data.gstNumber,
          officialEmail: data.officialEmail,
          verified: true,
          verificationStatus: "verified",
          verificationSubmittedAt: new Date().toISOString(),
          totalFunded: 0,
          activeCampaignsCount: 0,
        };
        return [...prev, newOrg];
      }
    });

    // Update current user name if company name is specified
    setCurrentUser(prev => ({ ...prev, name: data.orgName }));

    addNotification(
      currentUser.id,
      "Bidder/Organization Verified",
      "Your company registration and GST details have been verified. You can now launch and escrow-fund campaigns.",
      "campaign"
    );

    addAuditLog(
      "ORGANIZER_VERIFIED",
      "system",
      "organization",
      currentUser.id,
      `Organization ${data.orgName} verified with GST ${data.gstNumber}`
    );
  };

  // Create Campaign
  const createCampaign = (campaignData: Partial<Campaign>): Campaign => {
    const prizePool = campaignData.prizePool || 10000;
    const winnerCount = campaignData.winnerCount || 3;
    const calc = calculateConfigurablePrizePool(prizePool, winnerCount);

    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      organizerId: currentUser.organizationId || "org-apex",
      organizerName: currentUser.name,
      organizerLogo: currentUser.avatarUrl,
      title: campaignData.title || "Untitled Competition",
      description: campaignData.description || "",
      category: campaignData.category || "technology",
      productPromoted: campaignData.productPromoted || "",
      targetAudience: campaignData.targetAudience || "Pan-India Creators",
      targetLocation: campaignData.targetLocation || "India",
      contentFormat: campaignData.contentFormat || "Reel",
      socialPlatform: campaignData.socialPlatform || "Instagram",
      minDurationSec: campaignData.minDurationSec || 20,
      maxDurationSec: campaignData.maxDurationSec || 60,
      aspectRatio: campaignData.aspectRatio || "9:16",
      prizePool,
      winnerCount,
      prizeTiers: calc.tiers,
      firstPrize: calc.firstPlace,
      secondPrize: calc.secondPlace,
      thirdPrize: calc.thirdPlace,
      platformFee: calc.platformFee,
      totalFunded: calc.totalPayable,
      paymentStatus: "unpaid",
      status: "under_review",
      startDate: new Date().toISOString(),
      submissionDeadline: campaignData.submissionDeadline || new Date(Date.now() + 30 * 86400000).toISOString(),
      reviewPeriodDays: campaignData.reviewPeriodDays || 3,
      maxSubmissionsPerCreator: campaignData.maxSubmissionsPerCreator || 1,
      scoringFormula: campaignData.scoringFormula || "weighted_engagement",
      requirements: campaignData.requirements || [],
      brandGuidelines: campaignData.brandGuidelines || "",
      referenceLinks: campaignData.referenceLinks || [],
      enrolledCreatorIds: [],
      createdAt: new Date().toISOString(),
      ...campaignData,
    };

    setCampaigns(prev => [newCampaign, ...prev]);
    addAuditLog("CAMPAIGN_CREATED", currentUser.role, "campaign", newCampaign.id, `Created campaign "${newCampaign.title}"`);
    return newCampaign;
  };

  // Fund Campaign
  const fundCampaign = async (campaignId: string, paymentMethod: string): Promise<boolean> => {
    const paymentRef = `TXN_GATEWAY_${Date.now()}_MOCK`;
    setCampaigns(prev =>
      prev.map(c => {
        if (c.id === campaignId) {
          return {
            ...c,
            paymentStatus: "funded",
            paymentReference: paymentRef,
            status: "active", // automatically activate if approved/funded
          };
        }
        return c;
      })
    );
    addAuditLog("CAMPAIGN_FUNDED", "organizer", "campaign", campaignId, `Campaign funded via ${paymentMethod}. Gateway Ref: ${paymentRef}`);
    return true;
  };

  // Enroll in Campaign
  const enrollInCampaign = (campaignId: string, creatorId: string): boolean => {
    let success = false;
    setCampaigns(prev =>
      prev.map(c => {
        if (c.id === campaignId) {
          if (c.enrolledCreatorIds.includes(creatorId)) {
            return c;
          }
          success = true;
          return {
            ...c,
            enrolledCreatorIds: [...c.enrolledCreatorIds, creatorId],
          };
        }
        return c;
      })
    );
    if (success) {
      addNotification(creatorId, "Enrollment Confirmed", "You successfully enrolled in the competition. Check the brief and submit your content URL before deadline.", "campaign");
      addAuditLog("CREATOR_ENROLLED", "creator", "campaign", campaignId, `Creator ${creatorId} enrolled.`);
    }
    return success;
  };

  // Submit Content
  const submitContent = async (
    campaignId: string,
    creatorId: string,
    contentUrl: string,
    platform: "Instagram" | "YouTube",
    caption: string,
    notes?: string
  ): Promise<Submission> => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) throw new Error("Campaign not found");

    // Check duplicate
    const existing = submissions.find(s => s.contentUrl === contentUrl);
    if (existing) {
      throw new Error("This content URL has already been submitted to the platform.");
    }

    // Run verification engine
    const verificationResult = runAutomatedVerification(
      contentUrl,
      platform,
      caption,
      campaign.requirements,
      campaign.scoringFormula
    );

    const newSub: Submission = {
      id: `sub-${Date.now()}`,
      campaignId,
      creatorId,
      creatorName: currentUser.name,
      creatorAvatar: currentUser.avatarUrl,
      contentUrl,
      platform,
      submittedAt: new Date().toISOString(),
      notes,
      status: verificationResult.allMandatoryPassed ? "approved" : "rejected",
      rejectionReason: verificationResult.allMandatoryPassed ? undefined : "One or more mandatory campaign requirements were not verified.",
      verificationChecks: verificationResult.checks,
      metrics: verificationResult.metrics,
      metricSnapshots: verificationResult.metricSnapshots,
      calculatedScore: verificationResult.score,
      fraudRisk: verificationResult.fraudRisk,
      fraudAnalysisNotes: verificationResult.fraudAnalysisNotes,
    };

    setSubmissions(prev => [newSub, ...prev]);

    // Notify creator & organizer
    addNotification(
      creatorId,
      verificationResult.allMandatoryPassed ? "Submission Verified" : "Submission Requirements Alert",
      verificationResult.allMandatoryPassed
        ? `Your submission passed all automated checks with score ${newSub.calculatedScore}.`
        : "Your submission did not satisfy all mandatory brief requirements. Please check your verification report.",
      "submission"
    );

    addAuditLog(
      "CONTENT_SUBMITTED",
      "creator",
      "submission",
      newSub.id,
      `Submitted URL ${contentUrl}. Automated verification: ${verificationResult.allMandatoryPassed ? "PASSED" : "FAILED"}`
    );

    return newSub;
  };

  // Get Campaign Leaderboard
  const getCampaignLeaderboard = (campaignId: string): LeaderboardEntry[] => {
    const campaign = campaigns.find(c => c.id === campaignId);
    const campaignSubs = submissions.filter(s => s.campaignId === campaignId);

    // Sort by calculated score descending
    const sorted = [...campaignSubs].sort((a, b) => b.calculatedScore - a.calculatedScore);

    return sorted.map((sub, index) => {
      const isCompliant = sub.status === "approved";
      const isEligible = isCompliant && sub.fraudRisk !== "High Risk";
      const rank = index + 1;

      let prize: number | undefined = undefined;
      if (campaign && isEligible) {
        if (campaign.prizeTiers && campaign.prizeTiers.length > 0) {
          const tier = campaign.prizeTiers.find(t => t.rank === rank);
          if (tier) prize = tier.amount;
        } else {
          // fallback
          if (rank === 1) prize = campaign.firstPrize;
          else if (rank === 2) prize = campaign.secondPrize;
          else if (rank === 3) prize = campaign.thirdPrize;
        }
      }

      return {
        rank,
        creatorId: sub.creatorId,
        creatorName: sub.creatorName,
        creatorAvatar: sub.creatorAvatar,
        submissionId: sub.id,
        contentUrl: sub.contentUrl,
        views: sub.metrics.views,
        likes: sub.metrics.likes,
        comments: sub.metrics.comments,
        performanceScore: sub.calculatedScore,
        compliancePassed: isCompliant,
        fraudStatus: sub.fraudRisk,
        isEligibleWinner: isEligible,
        allocatedPrize: prize,
      };
    });
  };

  // Finalize Campaign & Generate Payouts
  const finalizeCampaignResults = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) return;

    const winnerLimit = campaign.winnerCount || 3;
    const leaderboard = getCampaignLeaderboard(campaignId);
    const eligibleWinners = leaderboard.filter(e => e.isEligibleWinner).slice(0, winnerLimit);

    const newPayouts: PayoutRecord[] = eligibleWinners.map((winner, idx) => ({
      id: `payout-${Date.now()}-${idx}`,
      campaignId,
      campaignTitle: campaign.title,
      creatorId: winner.creatorId,
      creatorName: winner.creatorName,
      rank: winner.rank,
      amount: winner.allocatedPrize || 0,
      status: "Approved",
      initiatedAt: new Date().toISOString(),
    }));

    setPayouts(prev => [...newPayouts, ...prev]);
    setCampaigns(prev =>
      prev.map(c => (c.id === campaignId ? { ...c, status: "completed" } : c))
    );

    addAuditLog("CAMPAIGN_FINALIZED", "admin", "campaign", campaignId, `Locked leaderboard and allocated prizes to ${eligibleWinners.length} winners.`);
  };

  // Admin moderation functions
  const approveCampaignAdmin = (campaignId: string) => {
    setCampaigns(prev =>
      prev.map(c => (c.id === campaignId ? { ...c, status: c.paymentStatus === "funded" ? "active" : "under_review" } : c))
    );
    addAuditLog("CAMPAIGN_APPROVED", "admin", "campaign", campaignId, "Campaign approved by platform administrator.");
  };

  const moderateSubmissionAdmin = (
    submissionId: string,
    status: "approved" | "rejected" | "disqualified",
    notes?: string
  ) => {
    setSubmissions(prev =>
      prev.map(s => {
        if (s.id === submissionId) {
          return {
            ...s,
            status,
            rejectionReason: status !== "approved" ? notes || "Moderated by administrator" : undefined,
            manualReviewedBy: currentUser.name,
          };
        }
        return s;
      })
    );
    addAuditLog("SUBMISSION_MODERATED", "admin", "submission", submissionId, `Status updated to ${status}. Notes: ${notes || "None"}`);
  };

  const resolveDisputeAdmin = (disputeId: string, resolution: string) => {
    setDisputes(prev =>
      prev.map(d =>
        d.id === disputeId ? { ...d, status: "Resolved", resolutionNotes: resolution } : d
      )
    );
    addAuditLog("DISPUTE_RESOLVED", "admin", "dispute", disputeId, resolution);
  };

  const processPayoutAdmin = (payoutId: string) => {
    const ref = `TXN_UPI_${Date.now()}`;
    setPayouts(prev =>
      prev.map(p =>
        p.id === payoutId
          ? {
              ...p,
              status: "Paid",
              transactionRef: ref,
              completedAt: new Date().toISOString(),
            }
          : p
      )
    );
    addAuditLog("PAYOUT_DISBURSED", "admin", "payout", payoutId, `Processed payment with ref ${ref}`);
  };

  const resetToSampleData = () => {
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setCampaigns(INITIAL_CAMPAIGNS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setPayouts(INITIAL_PAYOUTS);
    setDisputes(INITIAL_DISPUTES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        organizations,
        creatorProfiles,
        campaigns,
        submissions,
        payouts,
        disputes,
        auditLogs,
        notifications,
        login,
        register,
        logout,
        submitCreatorVerification,
        submitOrganizerVerification,
        createCampaign,
        fundCampaign,
        enrollInCampaign,
        submitContent,
        getCampaignLeaderboard,
        approveCampaignAdmin,
        moderateSubmissionAdmin,
        resolveDisputeAdmin,
        processPayoutAdmin,
        finalizeCampaignResults,
        addNotification,
        resetToSampleData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
