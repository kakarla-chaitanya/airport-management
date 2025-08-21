const RegisterForm = () => {
    return (
        <>
            <h2 className="auth-title">Create Account</h2>
            <form className="auth-form">
                <div className="auth-form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" placeholder="Your full name" />
                </div>

                <div className="auth-form-group">
                  <label htmlFor="role">Role</label>
                  <select id="role" className="auth-select">
                    <option value="" disabled selected>Select your role</option>
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                    <option value="security">Security</option>
                  </select>
                </div>

                <div className="auth-form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="Email" />
                </div>

                {/* <div className="auth-form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" placeholder="Choose a username" />
                </div> */}

                <div className="auth-form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="••••••••" />
                </div>

                <button className="auth-button">Sign up</button>
            </form>

            <div className="auth-footer">
                Already have an account? <a href="/auth/login">Log in</a>
            </div>
        </>
    );
};

export default RegisterForm;
