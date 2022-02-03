set -e

mongo <<EOF
use $MONGO_INITDB_DATABASE

db.createUser({
  user: '$DB_USER',
  pwd: '$DB_PWD',
  roles: [{
    role: 'readWrite',
    db: '$MONGO_INITDB_DATABASE'
  }]
})

db.createCollection('courses',
    {
      title: "string",
      accessCode: "string",
      startDate: "timestamp",
      endDate: "timestamp"
    }
)

db.createCollection('users',
    {
      name: "string",
      teaches: "array",
      enrolledIn: "array"
    }
)

db.createCollection('projects',
    {
      courseId: "objectId",
      title: "string",
      formationDeadline: "timestamp",
      minGroupSize: "int",
      maxGroupSize: "int",
      roles: "array"
    }
)

db.createCollection('profiles',
    {
      userId: "objectId",
      courseId: "objectId",
      courseTitle: "string",
      bio: "string",
      skills: "array",
      availability: "array",
      relevantCourses: "array",
      role: "string"
    }
)

db.createCollection('swipes',
    {
      projectId: "objectId",
      senderId: "objectId",
      targetId: "objectId",
      targetBio: "string",
      targetSkills: "array",
      targetAvailability: "array",
      targetCourses: "array",
      targetRole: "string",
      status: "string"
    }
)

db.createCollection('preferences',
    {
      filters: "array"
    }
)

db.createCollection('messages',
    {
      text: "string",
      profileId: "objectId",
      groupId: "objectId",
      timestamp: "timestamp"
    }
)
EOF