const LoginForm = () => {
    return (
        <>
            <h2 className="auth-title">Welcome Back</h2>
            <form className="auth-form">
                <div className="auth-form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" placeholder="Enter your username" />
                </div>

                <div className="auth-form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="••••••••" />
                </div>

                <button className="auth-button">Log in</button>
            </form>

            <div className="auth-footer">
                Don't have an account? <a href="/auth/register">Sign up</a>
            </div>
        </>
    );
};

export default LoginForm;
