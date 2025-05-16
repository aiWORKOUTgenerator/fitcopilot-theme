/**
 * Available injury categories and options for user selection
 */
export const INJURY_CATEGORIES = {
  jointLigament: {
    label: 'Joint & Ligament Injuries',
    options: [
      'Shoulder Impingement',
      'Rotator Cuff Tear or Strain',
      'Frozen Shoulder',
      'Elbow Tendonitis (Tennis Elbow or Golfer\'s Elbow)',
      'Wrist Strain or Carpal Tunnel Syndrome',
      'Knee Ligament Injury (ACL, MCL, PCL, or LCL Tear or Strain)',
      'Meniscus Tear',
      'Patellar Tendonitis (Jumper\'s Knee)',
      'Ankle Sprain',
      'Plantar Fasciitis'
    ]
  },
  muscleTendon: {
    label: 'Muscle & Tendon Strains',
    options: [
      'Lower Back Strain',
      'Hamstring Strain',
      'Quadriceps Strain',
      'Calf Strain',
      'Hip Flexor Strain',
      'Groin Strain',
      'Biceps or Triceps Strain',
      'Achilles Tendonitis'
    ]
  },
  chronicOveruse: {
    label: 'Chronic and Overuse Injuries',
    options: [
      'Arthritis (Osteoarthritis or Rheumatoid)',
      'Sciatica (Nerve Pain)',
      'IT Band Syndrome',
      'Shin Splints',
      'Runner\'s Knee',
      'Stress Fractures',
      'Herniated Disc or Bulging Disc',
      'Chronic Neck Pain',
      'Chronic Lower Back Pain'
    ]
  },
  postSurgical: {
    label: 'Post-Surgical and Recovery Injuries',
    options: [
      'Post-Surgery Knee Recovery',
      'Post-Surgery Shoulder Recovery',
      'Post-Surgery Hip Recovery',
      'Post-Surgery Ankle Recovery',
      'Spinal Fusion or Disc Surgery Recovery'
    ]
  },
  otherLimitations: {
    label: 'Other Common Limitations',
    options: [
      'Balance and Stability Issues',
      'Chronic Fatigue Syndrome',
      'Fibromyalgia',
      'Postural Issues (Kyphosis, Lordosis, or Scoliosis)'
    ]
  }
};

// Flattened list of all injuries
export const ALL_INJURIES = Object.values(INJURY_CATEGORIES).flatMap(category => category.options); 