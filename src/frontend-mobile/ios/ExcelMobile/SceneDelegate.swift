import UIKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = (scene as? UIWindowScene) else { return }
        
        // Create the main window and set its root view controller
        window = UIWindow(windowScene: windowScene)
        
        // Assuming WorkbookViewController is the initial view controller
        let workbookViewController = WorkbookViewController()
        let navigationController = UINavigationController(rootViewController: workbookViewController)
        
        window?.rootViewController = navigationController
        window?.makeKeyAndVisible()
        
        // Set up API service for this scene
        APIService.shared.configureForScene(session: session)
        
        // Set up authentication service for this scene
        AuthenticationService.shared.configureForScene(session: session)
    }

    func sceneDidDisconnect(_ scene: UIScene) {
        // Called when a scene has been disconnected from the app
        // Perform cleanup tasks
        APIService.shared.cleanupForScene()
        AuthenticationService.shared.cleanupForScene()
    }

    func sceneDidBecomeActive(_ scene: UIScene) {
        // Called when a scene has become active
        // Restart any tasks that were paused while the scene was inactive
        APIService.shared.resumeOperations()
        AuthenticationService.shared.refreshTokenIfNeeded()
    }

    func sceneWillResignActive(_ scene: UIScene) {
        // Called when a scene is about to resign active state
        // Pause ongoing tasks and disable timers
        APIService.shared.pauseOperations()
    }

    func sceneWillEnterForeground(_ scene: UIScene) {
        // Called when a scene is about to enter the foreground
        // Undo changes made on entering the background
        APIService.shared.reconnectIfNeeded()
    }

    func sceneDidEnterBackground(_ scene: UIScene) {
        // Called when a scene has entered the background
        // Save data, release shared resources, and store enough scene-specific state information
        // to restore the scene back to its current state
        APIService.shared.saveCurrentState()
        AuthenticationService.shared.secureSessionData()
    }
}