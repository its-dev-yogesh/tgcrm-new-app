const UserProtectedComponent = () => {
  return (
    <div>
      {/* Nested routes */}
      <Route exact path="/protected/nested1" component={<>hi</>} />
      <Route exact path="/protected/nested2" component={<>hi</>} />
    </div>
  );
};
