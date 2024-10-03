#ifndef ICOLLABORATION_SERVICE_H
#define ICOLLABORATION_SERVICE_H

#include <string>
#include <vector>

namespace Microsoft {
namespace Excel {
namespace CoreEngine {

/**
 * @class ICollaborationService
 * @brief Interface for the Collaboration Service, which manages real-time collaboration features in Microsoft Excel.
 *
 * This interface defines the contract for managing real-time collaboration features,
 * enabling multiple users to work on the same workbook simultaneously.
 */
class ICollaborationService {
public:
    /**
     * @brief Virtual destructor for proper cleanup of derived classes.
     */
    virtual ~ICollaborationService() = default;

    /**
     * @brief Initiates a collaboration session for a specific workbook.
     * @param workbookId The unique identifier of the workbook.
     * @param userId The unique identifier of the user initiating the session.
     * @return True if the session was successfully initiated, false otherwise.
     */
    virtual bool InitiateCollaborationSession(const std::string& workbookId, const std::string& userId) = 0;

    /**
     * @brief Joins an existing collaboration session.
     * @param sessionId The unique identifier of the collaboration session.
     * @param userId The unique identifier of the user joining the session.
     * @return True if the user successfully joined the session, false otherwise.
     */
    virtual bool JoinCollaborationSession(const std::string& sessionId, const std::string& userId) = 0;

    /**
     * @brief Leaves a collaboration session.
     * @param sessionId The unique identifier of the collaboration session.
     * @param userId The unique identifier of the user leaving the session.
     */
    virtual void LeaveCollaborationSession(const std::string& sessionId, const std::string& userId) = 0;

    /**
     * @brief Synchronizes changes made by a user with other collaborators.
     * @param sessionId The unique identifier of the collaboration session.
     * @param changes A vector of changes to be synchronized.
     */
    virtual void SyncChanges(const std::string& sessionId, const std::vector<Change>& changes) = 0;

    /**
     * @brief Retrieves a list of collaborators in a session.
     * @param sessionId The unique identifier of the collaboration session.
     * @return A vector of collaborator IDs.
     */
    virtual std::vector<std::string> GetCollaborators(const std::string& sessionId) = 0;
};

} // namespace CoreEngine
} // namespace Excel
} // namespace Microsoft

#endif // ICOLLABORATION_SERVICE_H