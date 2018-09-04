package org.silkframework.runtime.activity

import org.silkframework.runtime.users.User

/**
  * User context that should be propagated to all actions involving creating, modifying, deleting, executing or querying
  * resources, tasks etc. Used, among other things, for access control, provenance and logging.
  */
trait UserContext {
  def user: Option[User]
}

object UserContext {

  /** User context that returns no user.
    * This should be used where no user context makes sense, is not available or for tests. */
  object Empty extends UserContext {
    def user: Option[User] = None
  }

  // TODO: REMOVE
  val REMOVE_THIS = Empty

}

case class SimpleUserContext(user: Option[User]) extends UserContext