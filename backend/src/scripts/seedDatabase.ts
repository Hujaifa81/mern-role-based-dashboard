import mongoose from 'mongoose';
import { User } from '../app/modules/user/user.model';
import { ActivityLog } from '../app/modules/activityLog/activityLog.model';
import { Role, Status } from '../app/modules/user/user.interface';
import { ActivityType } from '../app/modules/activityLog/activityLog.interface';
import { hashedPassword } from '../app/utils/bcryptHelper';
import { envVars } from '../app/config';

const sampleUsers = [
  {
    name: 'Admin',
    email: 'admin@gmail.com',
    password: 'Admin@123',
    role: Role.ADMIN,
    status: Status.ACTIVE,
    isVerified: true,
  },
  {
    name: 'Abu Hasan',
    email: 'hasan@gmail.com',
    password: 'User@123',
    role: Role.USER,
    status: Status.ACTIVE,
    isVerified: true,
  },
  {
    name: 'Mahmudul Hasan',
    email: 'mahmudul.hasan@yahoo.com',
    password: 'User@123',
    role: Role.USER,
    status: Status.ACTIVE,
    isVerified: true,
  },
  {
    name: 'Sabina Khatun',
    email: 'sabina.khatun@outlook.com',
    password: 'User@123',
    role: Role.USER,
    status: Status.ACTIVE,
    isVerified: true,
  },
  {
    name: 'Rofikul Islam',
    email: 'rofikul.islam@gmail.com',
    password: 'User@123',
    role: Role.USER,
    status: Status.ACTIVE,
    isVerified: false,
  },
  {
    name: 'Nazma Begum',
    email: 'nazma.begum@gmail.com',
    password: 'User@123',
    role: Role.USER,
    status: Status.SUSPENDED,
    isVerified: true,
  },
  {
    name: 'Kamal Uddin',
    email: 'kamal.uddin@yahoo.com',
    password: 'User@123',
    role: Role.USER,
    status: Status.ACTIVE,
    isVerified: true,
  },
  {
    name: 'Fatema Sultana',
    email: 'fatema.sultana@gmail.com',
    password: 'User@123',
    role: Role.USER,
    status: Status.ACTIVE,
    isVerified: false,
  },
];

const generateActivityLogs = async (users: any[]) => {
  const activities: any[] = [];
  const activityTypes = [
    ActivityType.USER_LOGIN,
    ActivityType.USER_LOGOUT,
    ActivityType.PASSWORD_CHANGED,
    ActivityType.PROFILE_UPDATED,
    ActivityType.EMAIL_VERIFIED,
  ];

  const now = new Date();
  for (let i = 2; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const numActivities = Math.floor(Math.random() * 6) + 3;

    for (let j = 0; j < numActivities; j++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomType =
        activityTypes[Math.floor(Math.random() * activityTypes.length)];

      activities.push({
        user: randomUser._id,
        activityType: randomType,
        description: getActivityDescription(randomType, randomUser.name),
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'agent-' + Math.random().toString(36).substring(7),
        createdAt: date,
      });
    }
  }

  const admin = users.find((u) => u.role === Role.ADMIN);
  const regularUsers = users.filter((u) => u.role === Role.USER);

  activities.push({
    user: admin._id,
    activityType: ActivityType.USER_CREATED,
    description: `Admin created user: ${regularUsers[0].email}`,
    targetUser: regularUsers[0]._id,
    createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  });

  activities.push({
    user: admin._id,
    activityType: ActivityType.ROLE_CHANGED,
    description: `Changed user role to USER`,
    targetUser: regularUsers[1]._id,
    metadata: { oldRole: Role.USER, newRole: Role.USER },
    createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  });

  activities.push({
    user: admin._id,
    activityType: ActivityType.USER_SUSPENDED,
    description: `Suspended user account`,
    targetUser: users.find((u) => u.status === Status.SUSPENDED)?._id,
    createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  });

  return activities;
};

const getActivityDescription = (type: ActivityType, userName: string) => {
  switch (type) {
    case ActivityType.USER_LOGIN:
      return `${userName} logged in successfully`;
    case ActivityType.USER_LOGOUT:
      return `${userName} logged out`;
    case ActivityType.PASSWORD_CHANGED:
      return `${userName} changed their password`;
    case ActivityType.PROFILE_UPDATED:
      return `${userName} updated their profile`;
    case ActivityType.EMAIL_VERIFIED:
      return `${userName} verified their email`;
    default:
      return `${userName} performed an action`;
  }
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(envVars.DB_URL as string);
    console.log('✅ Connected to MongoDB');

    await User.deleteMany({});
    await ActivityLog.deleteMany({});
    console.log('🗑️  Cleared existing data');

    const usersToCreate = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await hashedPassword(user.password),
        auths: [
          {
            provider: 'credentials',
            providerId: user.email,
          },
        ],
      }))
    );

    const createdUsers = await User.insertMany(usersToCreate);
    console.log(`✅ Created ${createdUsers.length} users`);

    const activities = await generateActivityLogs(createdUsers);
    await ActivityLog.insertMany(activities);
    console.log(`✅ Created ${activities.length} activity logs`);

    console.log('\n📊 Database seeded successfully!');
    console.log('\n🔐 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:');
    console.log('  Email: admin@gmail.com');
    console.log('  Password: Admin@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('User:');
    console.log('  Email: hasan@gmail.com');
    console.log('  Password: User@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error(' Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
