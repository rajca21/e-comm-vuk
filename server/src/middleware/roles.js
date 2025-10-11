export function requireRole(role) {
  return (req, res, next) => {
    const user = req.user; // set by requireAuth
    if (!user || user.role !== role) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}
