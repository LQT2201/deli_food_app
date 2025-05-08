import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  selectAuthLoading,
  selectAuthError,
  clearError,
} from "../slices/authSlice";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const handleLogin = async () => {
    if (!email || !password) {
      dispatch(clearError());
      return;
    }

    dispatch(loginUser({ email, password }));
  };

  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-1 justify-center">
        <Text className="text-3xl font-bold text-center mb-8">Login</Text>

        {error && (
          <Text className="text-red-500 text-center mb-4">{error}</Text>
        )}

        <TextInput
          className="border border-gray-300 rounded-lg p-4 mb-4"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          className="border border-gray-300 rounded-lg p-4 mb-6"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          className="bg-[#00CCBB] rounded-lg p-4"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold text-lg">
              Login
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-4"
          onPress={() => navigation.navigate("Register")}
        >
          <Text className="text-center text-gray-500">
            Don't have an account?{" "}
            <Text className="text-[#00CCBB]">Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
