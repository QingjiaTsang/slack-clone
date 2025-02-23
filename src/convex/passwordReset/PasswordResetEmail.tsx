import {
  Container,
  Head,
  Heading,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export function PasswordResetEmail({
  code,
  expires,
}: {
  code: string;
  expires: Date;
}) {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Container className="container px-20 font-sans">
          <Heading className="text-xl font-bold mb-4">
            Reset your password in Slack App
          </Heading>
          <Text className="text-sm">
            Please enter the following code on the password reset page.
          </Text>
          <Section className="text-center">
            <Text className="font-semibold">Verification code</Text>
            <Text className="font-bold text-4xl">{code}</Text>
            <Text>
              (This code is valid for{" "}
              {Math.ceil((+expires - Date.now()) / (60 * 1000))} minutes)
            </Text>
          </Section>
        </Container>
      </Tailwind>
    </Html>
  );
}
