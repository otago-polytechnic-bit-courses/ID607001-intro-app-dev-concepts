import User from '../models/users.js'
import Institution from '../models/institutions.js'
import Department from '../models/departments.js'
import Course from '../models/courses.js'

/**
 * Delete all resources. If you want to mock your data,
 * avoid using seeder.js
 */
const deleteResources = () => {
  User.deleteMany({}, (error) => {})
  Institution.deleteMany({}, (error) => {})
  Department.deleteMany({}, (error) => {})
  Course.deleteMany({}, (error) => {})
}

/**
 * Delete all resources before each test. This method is
 * commonly called setUp in other programming languages, i.e., Python
 */
beforeEach((done) => {
  deleteResources()
  done()
})

/**
 * Delete all resources after each test. This method is
 * commonly called tearDown in other programming languages, i.e., Python
 */
afterEach((done) => {
  deleteResources()
  done()
})
