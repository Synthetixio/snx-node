import {
  Box,
  Button,
  Code,
  Heading,
  Icon,
  Spinner,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import { useMutation } from '@tanstack/react-query';
import { usePeerId } from './usePeerId';
import { usePeers } from './usePeers';
import { useRateIn } from './useRateIn';
import { useRateOut } from './useRateOut';
import { useHostingSize } from './useHostingSize';
import { useIsIpfsRunning } from './useIsIpfsRunning';
import { useIsIpfsInstalled } from './useIsIpfsInstalled';
import { useIsFollowerRunning } from './useIsFollowerRunning';
import { useIsFollowerInstalled } from './useIsFollowerInstalled';
import { useFollowerInfo } from './useFollowerInfo';
import { SYNTHETIX_IPNS } from '../../../const';

function handleCopy(text: string) {
  if (text) {
    navigator.clipboard.writeText(text);
  }
}

function StatusIcon(props: any) {
  return (
    <Box display="inline-block" mr="1" transform="translateY(-1px)" {...props}>
      <Icon viewBox="0 0 200 200">
        <path
          fill="currentColor"
          d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
        />
      </Icon>
    </Box>
  );
}

const { ipcRenderer } = window?.electron || {};

export function useInstallIpfs() {
  return useMutation({
    mutationKey: ['ipfs', 'install'],
    mutationFn: () => ipcRenderer.invoke('install-ipfs'),
    enabled: Boolean(ipcRenderer),
  });
}

export function useInstallFollower() {
  return useMutation({
    mutationKey: ['follower', 'install'],
    mutationFn: () => ipcRenderer.invoke('install-follower'),
    enabled: Boolean(ipcRenderer),
  });
}

export function useRunIpfs() {
  return useMutation({
    mutationKey: ['ipfs', 'run'],
    mutationFn: () => ipcRenderer.invoke('run-ipfs'),
    enabled: Boolean(ipcRenderer),
  });
}

export function useRunFollower() {
  return useMutation({
    mutationKey: ['follower', 'run'],
    mutationFn: () => ipcRenderer.invoke('run-follower'),
    enabled: Boolean(ipcRenderer),
  });
}

export function Ipfs() {
  const { data: isIpfsInstalled } = useIsIpfsInstalled();
  const { data: isIpfsRunning } = useIsIpfsRunning();
  const { data: isFollowerInstalled } = useIsFollowerInstalled();
  const { data: isFollowerRunning } = useIsFollowerRunning();
  const { data: peers } = usePeers();
  const { data: peerId } = usePeerId();
  const { data: followerInfo } = useFollowerInfo();
  const rateIn = useRateIn();
  const rateOut = useRateOut();
  const hostingSize = useHostingSize();
  console.log({
    followerInfo,
    isInstalled: isIpfsInstalled,
    isRunning: isIpfsRunning,
    peers,
    peerId,
    rateIn,
    rateOut,
    hostingSize,
  });

  const { mutate: onInstallIpfs, isLoading: isInstallIpfsLoading } =
    useInstallIpfs();

  const { mutate: onRunIpfs, isLoading: isRunIpfsLoading } = useRunIpfs();

  const { mutate: onInstallFollower, isLoading: isInstallFollowerLoading } =
    useInstallFollower();

  const { mutate: onRunFollower, isLoading: isRunFollowerLoading } =
    useRunFollower();

  return (
    <Box pt="4">
      <Box flex="1" p="0">
        <Heading mb="3" size="sm">
          {isIpfsRunning ? (
            <Text as="span" whiteSpace="nowrap">
              <StatusIcon textColor="green.400" />
              <Text display="inline-block">IPFS node running</Text>
            </Text>
          ) : (
            <>
              {isIpfsInstalled ? (
                <Text as="span" whiteSpace="nowrap">
                  <StatusIcon textColor="yellow.400" />
                  <Text display="inline-block">
                    Your IPFS node is not running
                    <Button
                      colorScheme="yellow"
                      transform="translateY(-2px)"
                      ml="2"
                      size="xs"
                      onClick={onRunIpfs}
                      isLoading={isRunIpfsLoading}
                    >
                      Run IPFS node
                      {isRunIpfsLoading ? <Spinner size="xs" /> : null}
                    </Button>
                  </Text>
                </Text>
              ) : (
                <Text as="span" whiteSpace="nowrap">
                  <StatusIcon textColor="red.400" />
                  <Text display="inline-block">
                    IPFS node is not installed
                    <Button
                      colorScheme="green"
                      transform="translateY(-2px)"
                      ml="2"
                      size="xs"
                      onClick={onInstallIpfs}
                      isLoading={isInstallIpfsLoading}
                    >
                      Install IPFS node
                      {isInstallIpfsLoading ? <Spinner size="xs" /> : null}
                    </Button>
                  </Text>
                </Text>
              )}
            </>
          )}
        </Heading>
        <Heading mb="3" size="sm">
          {isFollowerRunning ? (
            <>
              {followerInfo.cluster ? (
                <Text as="span" whiteSpace="nowrap">
                  <StatusIcon textColor="green.400" />
                  <Text display="inline-block">
                    Connected to the Synthetix Cluster
                  </Text>
                </Text>
              ) : (
                <Text as="span" whiteSpace="nowrap">
                  <Spinner size="xs" mr="2" />
                  <Text display="inline-block">
                    Connecting to the Synthetix Cluster
                  </Text>
                </Text>
              )}
            </>
          ) : (
            <>
              {isFollowerInstalled ? (
                <Text as="span" whiteSpace="nowrap">
                  <StatusIcon textColor="yellow.400" />
                  <Text display="inline-block">
                    Synthetix node is not running
                    <Button
                      colorScheme="yellow"
                      transform="translateY(-2px)"
                      ml="2"
                      size="xs"
                      onClick={onRunFollower}
                      isLoading={isRunFollowerLoading}
                    >
                      Connect to Synthetix cluster
                      {isRunFollowerLoading ? <Spinner size="xs" /> : null}
                    </Button>
                  </Text>
                </Text>
              ) : (
                <Text as="span" whiteSpace="nowrap">
                  <StatusIcon textColor="red.400" />
                  <Text display="inline-block">
                    Synthetix node is not installed
                    <Button
                      colorScheme="green"
                      transform="translateY(-2px)"
                      ml="2"
                      size="xs"
                      onClick={onInstallFollower}
                      isLoading={isInstallFollowerLoading}
                    >
                      Install Synthetix cluster connector
                      {isInstallFollowerLoading ? <Spinner size="xs" /> : null}
                    </Button>
                  </Text>
                </Text>
              )}
            </>
          )}
        </Heading>
        <Stack direction="row" spacing={6} justifyContent="center" mb="3">
          <Stat>
            <StatLabel mb="0" opacity="0.8">
              Hosting
            </StatLabel>
            <StatNumber>
              {hostingSize ? `${hostingSize.toFixed(2)} Mb` : '-'}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel mb="0" opacity="0.8">
              Outgoing
            </StatLabel>
            <StatNumber>{rateOut ? rateOut : '-'}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel mb="0" opacity="0.8">
              Incoming
            </StatLabel>
            <StatNumber>{rateIn ? rateIn : '-'}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel mb="0" opacity="0.8">
              Peers
            </StatLabel>
            <StatNumber>{peers}</StatNumber>
          </Stat>
        </Stack>
        <Box mb="4" bg="whiteAlpha.300" w="100%" height="1px" />
        <Box mb="3">
          <Text
            fontSize="sm"
            textTransform="uppercase"
            letterSpacing="1px"
            opacity="0.8"
            mb="1"
          >
            Your Peer ID
          </Text>
          <Box display="flex" alignItems="center">
            <Code>{peerId ? peerId : '~'}</Code>
            {peerId && (
              <CopyIcon
                opacity="0.8"
                ml="2"
                cursor="pointer"
                onClick={() => handleCopy(peerId)}
              />
            )}
          </Box>
        </Box>
        <Box>
          <Text
            fontSize="sm"
            textTransform="uppercase"
            letterSpacing="1px"
            opacity="0.8"
            mb="1"
          >
            Synthetix Cluster IPNS
          </Text>
          <Box display="flex" alignItems="center">
            <Code fontSize="sm">{SYNTHETIX_IPNS}</Code>
            {SYNTHETIX_IPNS && (
              <CopyIcon
                opacity="0.8"
                ml="2"
                cursor="pointer"
                onClick={() => handleCopy(SYNTHETIX_IPNS)}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}