export type UserRole = "organizer" | "creator" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  createdAt: string;
  organizationId?: string;
}

export interface Organization {
  id: string;
  userId: string;
  name: string;
  logo: string;
  category: string;
  website: string;
  verified: boolean;
  verificationStatus?: "unverified" | "pending" | "verified" | "rejected";
  businessRegistrationNumber?: string;
  gstNumber?: string;
  officialEmail?: string;
  verificationSubmittedAt?: string;
  totalFunded: number;
  activeCampaignsCount: number;
}

export interface CreatorProfile {
  id: string;
  userId: string;
  displayName: string;
  handle: string;
  bio: string;
  categories: string[];
  totalEarnings: number;
  rankingsWon: number;
  connectedAccounts: {
    instagram?: string;
    youtube?: string;
  };
  verifiedIdentity: boolean;
  verificationStatus?: "unverified" | "pending" | "verified" | "rejected";
  govIdType?: string;
  govIdNumber?: string;
  socialFollowersCount?: number;
  portfolioUrl?: string;
  verificationSubmittedAt?: string;
}

export type ContentFormat = "Reel" | "Short" | "Long-form Video";
export type SocialPlatform = "Instagram" | "YouTube";
export type CampaignStatus = "draft" | "under_review" | "active" | "submission_closed" | "evaluating" | "completed";

export interface CampaignRequirementItem {
  id: string;
  type: "hashtag" | "keyword" | "spoken_phrase" | "visual_element" | "duration" | "aspect_ratio";
  title: string;
  description: string;
  mandatory: boolean;
  ruleValue: string; // e.g. "#CreatorBid", "Innovate your journey", "Product packaging in frame"
}

export interface Campaign {
  id: string;
  organizerId: string;
  organizerName: string;
  organizerLogo: string;
  title: string;
  description: string;
  category: string;
  productPromoted: string;
  targetAudience: string;
  targetLocation: string;
  contentFormat: ContentFormat;
  socialPlatform: SocialPlatform;
  minDurationSec: number;
  maxDurationSec: number;
  aspectRatio: string;
  prizePool: number;
  winnerCount: 3 | 5 | 10;
  prizeTiers: { rank: number; percentage: number; amount: number; label: string }[];
  firstPrize: number;
  secondPrize: number;
  thirdPrize: number;
  platformFee: number;
  totalFunded: number;
  paymentStatus: "unpaid" | "funded" | "refunded";
  paymentReference?: string;
  status: CampaignStatus;
  startDate: string;
  submissionDeadline: string;
  reviewPeriodDays: number;
  maxSubmissionsPerCreator: number;
  scoringFormula: "views_only" | "weighted_engagement"; // Weighted: (Views*0.4) + (Likes*0.4) + (Comments*0.2)
  requirements: CampaignRequirementItem[];
  brandGuidelines: string;
  referenceLinks: string[];
  enrolledCreatorIds: string[];
  createdAt: string;
}

export type SubmissionStatus = 
  | "submitted" 
  | "verification_in_progress" 
  | "approved" 
  | "rejected" 
  | "requires_correction" 
  | "disqualified" 
  | "finalized";

export type RequirementCheckStatus = "Passed" | "Failed" | "Inconclusive" | "Requires Manual Review";

export interface VerificationCheck {
  requirementId: string;
  requirementTitle: string;
  type: string;
  status: RequirementCheckStatus;
  confidenceScore: number; // 0 to 100
  evidence: string;
  deterministic: boolean;
}

export interface MetricSnapshot {
  timestamp: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  source: "official_api" | "creator_submission";
}

export type FraudRiskLevel = "Low Risk" | "Moderate Risk" | "High Risk" | "Requires Manual Investigation";

export interface Submission {
  id: string;
  campaignId: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  contentUrl: string;
  platform: SocialPlatform;
  submittedAt: string;
  notes?: string;
  status: SubmissionStatus;
  rejectionReason?: string;
  verificationChecks: VerificationCheck[];
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    engagementRate: number;
    lastUpdated: string;
  };
  metricSnapshots: MetricSnapshot[];
  calculatedScore: number;
  fraudRisk: FraudRiskLevel;
  fraudAnalysisNotes?: string;
  manualReviewedBy?: string;
}

export interface LeaderboardEntry {
  rank: number;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  submissionId: string;
  contentUrl: string;
  views: number;
  likes: number;
  comments: number;
  performanceScore: number;
  compliancePassed: boolean;
  fraudStatus: FraudRiskLevel;
  isEligibleWinner: boolean;
  allocatedPrize?: number;
}

export interface PayoutRecord {
  id: string;
  campaignId: string;
  campaignTitle: string;
  creatorId: string;
  creatorName: string;
  rank: number;
  amount: number;
  status: "Awaiting Results" | "Awaiting Verification" | "Approved" | "Processing" | "Paid" | "Failed";
  transactionRef?: string;
  initiatedAt: string;
  completedAt?: string;
}

export interface DisputeRecord {
  id: string;
  campaignId: string;
  submissionId?: string;
  raisedByUserId: string;
  raisedByName: string;
  raisedByRole: UserRole;
  title: string;
  description: string;
  evidenceLinks: string[];
  status: "Open" | "Under Review" | "Resolved" | "Dismissed";
  resolutionNotes?: string;
  createdAt: string;
}

export interface PlatformNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkUrl?: string;
  type: "campaign" | "submission" | "ranking" | "payment" | "dispute";
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  role: string;
  targetEntity: string;
  targetId: string;
  details: string;
  timestamp: string;
}
