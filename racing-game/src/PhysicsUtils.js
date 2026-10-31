// Physics utilities for the racing game
const PhysicsUtils = {
  // Calculate drift force based on speed and steering angle
  calculateDriftForce: (velocity, steeringAngle, maxDrift) => {
    const speed = Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z);
    const steeringForce = Math.abs(steeringAngle);
    const driftFactor = (speed / 20) * (steeringForce / Math.PI);
    return Math.min(driftFactor * maxDrift, maxDrift);
  },
  
  // Apply gravity to physics body
  applyGravity: (body, dt) => {
    body.velocity.y += body.mass * -9.82 * dt;
  },
  
  // Apply friction to physics body
  applyFriction: (body, dt) => {
    const friction = 0.1;
    const velocityMagnitude = Math.sqrt(body.velocity.x ** 2 + body.velocity.z ** 2);
    if (velocityMagnitude > 0) {
      const frictionForce = velocityMagnitude * friction;
      const frictionX = (body.velocity.x / velocityMagnitude) * -frictionForce;
      const frictionZ = (body.velocity.z / velocityMagnitude) * -frictionForce;
      body.velocity.x += frictionX * dt;
      body.velocity.z += frictionZ * dt;
    }
  },
  
  // Apply engine power to physics body
  applyEnginePower: (body, power, dt) => {
    if (power > 0) {
      const force = power * dt;
      body.velocity.x += force * Math.cos(body.quaternion.y);
      body.velocity.z += force * Math.sin(body.quaternion.y);
    }
  },
  
  // Calculate wheel rotation speed
  calculateWheelRotation: (velocity, radius) => {
    const speed = Math.sqrt(velocity.x ** 2 + velocity.z ** 2);
    return speed / radius;
  },
  
  // Apply steering torque to physics body
  applySteering: (body, steeringAngle, maxTorque) => {
    const torque = steeringAngle * maxTorque;
    body.torque.y = torque;
  },
  
  // Check if kart is moving for drift calculation
  isMoving: (body) => {
    const velocity = Math.sqrt(body.velocity.x ** 2 + body.velocity.z ** 2);
    return velocity > 0.1;
  },
  
  // Calculate kart's forward direction
  getForwardDirection: (quaternion) => {
    return new CANNON.Vec3(
      Math.cos(quaternion.y),
      0,
      Math.sin(quaternion.y)
    );
  },
  
  // Apply drift boost effect
  applyDriftBoost: (body, boostAmount, dt) => {
    const forward = PhysicsUtils.getForwardDirection(body.quaternion);
    const boostForce = boostAmount * dt;
    body.velocity.x += forward.x * boostForce;
    body.velocity.z += forward.z * boostForce;
  },
  
  // Update kart velocity based on input
  updateVelocity: (body, input, dt, maxSpeed) => {
    const velocity = body.velocity;
    const speed = Math.sqrt(velocity.x ** 2 + velocity.z ** 2);
    
    if (input.forward) {
      const force = input.forward * dt;
      velocity.x += Math.cos(body.quaternion.y) * force;
      velocity.z += Math.sin(body.quaternion.y) * force;
    }
    
    if (input.backward) {
      const force = input.backward * dt;
      velocity.x -= Math.cos(body.quaternion.y) * force;
      velocity.z -= Math.sin(body.quaternion.y) * force;
    }
    
    // Apply steering
    if (input.steering !== 0) {
      PhysicsUtils.applySteering(body, input.steering, 100);
    }
    
    // Apply friction
    PhysicsUtils.applyFriction(body, dt);
    
    // Limit speed
    if (speed > maxSpeed) {
      const ratio = maxSpeed / speed;
      velocity.x *= ratio;
      velocity.z *= ratio;
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PhysicsUtils;
}
if (typeof window !== 'undefined') {
  window.PhysicsUtils = PhysicsUtils;
}