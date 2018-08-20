'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/myGolfStatsDb';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-mygolfstatsdb';
exports.PORT = process.env.PORT || 8080;
exports.TEST_GOLFERID = "5b79872d19b3f42c6651094c";